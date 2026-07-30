#!/usr/bin/env node
// Builds playlist.m3u — the OkayIPTV demo/test playlist.
//
// Everything in the output is either public-domain-ish by licence (the Blender
// open movies, CC-BY) or an official free live stream from the broadcaster's
// own CDN (see tools/curate-live.mjs). No provider account, no re-stream, no
// third-party catalogue data.
//
// Two details are driven by how OkayIPTV's parser (src/utils/m3uParser.js)
// classifies entries, and both matter:
//
//   1. Content type comes from the URL before anything else: a URL containing
//      "/series/" is an episode, "/movie/" is a film, and a bare .mp4 would be
//      read as a film even when the title says S01 E01. The demo streams live
//      on archive.org, so the marker is carried in a query parameter
//      (?nfsrc=/series/…) — the classifier sees it, archive.org ignores it.
//
//   2. Inside one category the parser drops a film whose poster URL was
//      already claimed by another film (that is how it kills provider
//      duplicates). Reusing one cover for twenty films would therefore leave
//      one visible tile. Hence covers/<brand>-NN.jpg: the same five images,
//      copied to sixteen paths each, so every film in a category carries its
//      own poster URL.
//
// Usage: node tools/build-playlist.mjs [--base=https://host/path]

import { readFileSync, writeFileSync } from 'node:fs';

const DEFAULT_BASE = 'https://erimoezac.github.io/okaytv-demo-playlist';
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const BASE = (baseArg ? baseArg.slice('--base='.length) : DEFAULT_BASE).replace(/\/+$/, '');

// ---------------------------------------------------------------------------
// Stream sources — the Blender open movies (CC-BY), re-encoded to 480p and
// served from this repository. Ten to fifteen minutes each, H.264/AAC,
// faststart, byte ranges supported, so seeking and resume behave like a real
// VOD asset.
//
// The numeric file names are not laziness. OkayIPTV feeds the last path
// segment of the stream URL into its TMDB search (many providers put the real
// release title in the file name), and a segment like `tears_of_steel_720p`
// matches the actual film — the app then replaces the demo cover, the plot and
// the backdrop with that film's real metadata. `extractTitleFromUrl` bails out
// on a purely numeric segment, so `/vod/10004.mp4` keeps the demo's own
// artwork on every tile.
// ---------------------------------------------------------------------------
const VIDEOS = [
    { key: 'bbb', url: `${BASE}/vod/10001.mp4`, minutes: 10 },
    { key: 'sintel', url: `${BASE}/vod/10002.mp4`, minutes: 15 },
    { key: 'ed', url: `${BASE}/vod/10003.mp4`, minutes: 11 },
    { key: 'tos', url: `${BASE}/vod/10004.mp4`, minutes: 12 },
    { key: 'cosmos', url: `${BASE}/vod/10005.mp4`, minutes: 12 },
];

// Extra formats, kept in their own category so a tester can walk the player
// paths on purpose: HLS/ABR (hls.js on web, AVPlayer natively), Matroska and
// WebM (the VLCKit path on iOS), HEVC in an hvc1-tagged MP4, plus an HLS asset
// that ships several audio tracks and subtitle renditions.
const FORMAT_STREAMS = [
    { title: 'Testbild HLS · Multi-Bitrate (ABR)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', brand: 'midnight-circuit' },
    { title: 'Testbild MP4 · H.264 480p', url: `${BASE}/vod/10001.mp4`, brand: 'northbound' },
    { title: 'Testbild MKV · Matroska', url: `${BASE}/vod/10011.mkv`, brand: 'silent-atlas' },
    { title: 'Testbild WebM · VP9/Opus', url: `${BASE}/vod/10012.webm`, brand: 'ashes-of-tomorrow' },
    { title: 'Testbild MP4 · HEVC/H.265 720p', url: `${BASE}/vod/10013.mp4`, brand: 'neon-harbor' },
    { title: 'Testbild MP4 · Langer Film 15 Minuten', url: `${BASE}/vod/10002.mp4`, brand: 'midnight-circuit' },
];

// ---------------------------------------------------------------------------
// The five covers, and the title family that belongs to each of them. The
// titles have to stay inside their family: the brand name is printed on the
// artwork, so "Ashes of Tomorrow" under the Neon Harbor poster would read as a
// broken list rather than a demo one.
// ---------------------------------------------------------------------------
const BRANDS = ['northbound', 'midnight-circuit', 'silent-atlas', 'ashes-of-tomorrow', 'neon-harbor'];

const MOVIE_TITLES = {
    'midnight-circuit': [
        ['Midnight Circuit', 2019], ['Midnight Circuit II – Overdrive', 2021],
        ['Midnight Circuit III – Blackout', 2023], ['Midnight Circuit: Zero Day', 2024],
        ['Midnight Circuit: Neon Nights', 2025], ['Midnight Circuit – Der letzte Code', 2026],
        ['Midnight Circuit: Ghost Protocol', 2022], ['Midnight Circuit – Systemfehler', 2020],
        ['Midnight Circuit: Deep Freeze', 2018], ['Midnight Circuit – Schaltkreis der Angst', 2017],
        ['Midnight Circuit: Downtown', 2016], ['Midnight Circuit – Rebooted', 2026],
        ['Midnight Circuit: Static', 2023], ['Midnight Circuit – Die Quelle', 2021],
        ['Midnight Circuit: Firewall', 2019], ['Midnight Circuit – Endstation Neon', 2025],
    ],
    'silent-atlas': [
        ['The Silent Atlas', 2020], ['The Silent Atlas: Die verlorene Küste', 2022],
        ['The Silent Atlas II – Nordpassage', 2023], ['The Silent Atlas: Kompass des Nordens', 2024],
        ['The Silent Atlas – Das Kartenzimmer', 2025], ['The Silent Atlas: Tiefsee', 2021],
        ['The Silent Atlas – Letzte Expedition', 2026], ['The Silent Atlas: Inselgrab', 2019],
        ['The Silent Atlas – Sturmkap', 2018], ['The Silent Atlas: Der Meridian', 2017],
        ['The Silent Atlas – Bernsteinroute', 2016], ['The Silent Atlas: Salzstraße', 2026],
        ['The Silent Atlas – Höhle der Ahnen', 2022], ['The Silent Atlas: Südwind', 2023],
        ['The Silent Atlas – Schwarzes Wasser', 2024], ['The Silent Atlas: Nachtfahrt', 2025],
    ],
    'ashes-of-tomorrow': [
        ['Ashes of Tomorrow', 2021], ['Ashes of Tomorrow: Rebirth', 2023],
        ['Ashes of Tomorrow II – Aschewinter', 2024], ['Ashes of Tomorrow: Die letzte Stadt', 2025],
        ['Ashes of Tomorrow – Funkstille', 2026], ['Ashes of Tomorrow: Staubjahre', 2022],
        ['Ashes of Tomorrow – Sirenen', 2020], ['Ashes of Tomorrow: Bunker Neun', 2019],
        ['Ashes of Tomorrow – Die Rückkehr', 2018], ['Ashes of Tomorrow: Glutkern', 2017],
        ['Ashes of Tomorrow – Nordlicht', 2016], ['Ashes of Tomorrow: Wasserzeichen', 2026],
        ['Ashes of Tomorrow – Letzte Ernte', 2023], ['Ashes of Tomorrow: Schattenmarsch', 2024],
        ['Ashes of Tomorrow – Feuerlinie', 2025], ['Ashes of Tomorrow: Morgengrauen', 2022],
    ],
    northbound: [
        ['Northbound', 2022], ['Northbound: Whiteout', 2024],
        ['Northbound II – Eiszeit', 2025], ['Northbound: Der letzte Konvoi', 2026],
        ['Northbound – Packeis', 2023], ['Northbound: Polarnacht', 2021],
        ['Northbound – Schneetreiben', 2020], ['Northbound: Kalte Spur', 2019],
        ['Northbound – Grenzland', 2018], ['Northbound: Nordwind', 2017],
        ['Northbound – Der Pass', 2016], ['Northbound: Frostbeulen', 2026],
        ['Northbound – Weißes Rauschen', 2024], ['Northbound: Treibgut', 2022],
        ['Northbound – Lawinengefahr', 2025], ['Northbound: Rentierpfad', 2023],
    ],
    'neon-harbor': [
        ['Neon Harbor', 2023], ['Neon Harbor: Hafenlichter', 2024],
        ['Neon Harbor II – Tiefgang', 2025], ['Neon Harbor: Kaikante', 2026],
        ['Neon Harbor – Nachtschicht', 2022], ['Neon Harbor: Containerbucht', 2021],
        ['Neon Harbor – Salzwasser', 2020], ['Neon Harbor: Hochwasser', 2019],
        ['Neon Harbor – Werftviertel', 2018], ['Neon Harbor: Regenbogenpier', 2017],
        ['Neon Harbor – Molenkopf', 2016], ['Neon Harbor: Fährmann', 2026],
        ['Neon Harbor – Dockstraße', 2024], ['Neon Harbor: Leuchtfeuer', 2022],
        ['Neon Harbor – Schleusenwärter', 2025], ['Neon Harbor: Tidenhub', 2023],
    ],
};

// Series titles per cover. Deliberately free of the words the parser reads as
// season/episode markers (Season, Staffel, Sezon, Folge, Bölüm, …) — one of
// those inside a show's name would truncate the name at that word.
const SERIES_TITLES = {
    northbound: ['Northbound', 'Northbound: Origins', 'Northbound – Die Küstenwache', 'Northbound: Cold Trail', 'Northbound – Grenzposten', 'Northbound: Weiße Wildnis', 'Northbound: Fährtenleser'],
    'midnight-circuit': ['Midnight Circuit', 'Midnight Circuit: Protokoll', 'Midnight Circuit – Datenspur', 'Midnight Circuit: Nachtschaltung', 'Midnight Circuit – Sektor Null', 'Midnight Circuit: Rauschen', 'Midnight Circuit – Kaltstart'],
    'silent-atlas': ['The Silent Atlas', 'The Silent Atlas: Expeditionen', 'The Silent Atlas – Kartenwerk', 'The Silent Atlas: Untiefen', 'The Silent Atlas – Randnotizen', 'The Silent Atlas: Windrose', 'The Silent Atlas: Passatwinde'],
    'ashes-of-tomorrow': ['Ashes of Tomorrow', 'Ashes of Tomorrow: Aftermath', 'Ashes of Tomorrow – Flugasche', 'Ashes of Tomorrow: Notruf', 'Ashes of Tomorrow – Trümmerpfad', 'Ashes of Tomorrow: Neuland', 'Ashes of Tomorrow – Wüstenlauf'],
    'neon-harbor': ['Neon Harbor', 'Neon Harbor: Reviermeldung', 'Neon Harbor – Kaischuppen', 'Neon Harbor: Nachtstreife', 'Neon Harbor – Hafenkrimi', 'Neon Harbor: Flutlicht', 'Neon Harbor: Hafenmeister'],
};

// Episode subtitles, cycled so every episode line carries a name the way a
// real provider list does.
const EPISODE_NAMES = [
    'Ankunft', 'Der Fund', 'Falsche Spur', 'Stromausfall', 'Nachtwache', 'Kalte Füße',
    'Zwei Zeugen', 'Der Anruf', 'Rückweg', 'Letzte Warnung', 'Unter Wasser', 'Blindflug',
    'Schichtwechsel', 'Alte Schulden', 'Der Plan', 'Endstation', 'Windstille', 'Hochdruck',
    'Ausnahmezustand', 'Heimkehr',
];

// ---------------------------------------------------------------------------
// Catalogue layout. `size` is how many films the row carries; the covers cycle
// through all five brands in order, so every row shows all five.
// ---------------------------------------------------------------------------
const MOVIE_CATEGORIES = [
    { name: 'DE | Neu im Katalog 2026', size: 30, offset: 0 },
    { name: 'DE | Action & Abenteuer', size: 30, offset: 3 },
    { name: 'DE | Thriller & Krimi', size: 28, offset: 6 },
    { name: 'DE | Sci-Fi & Fantasy', size: 26, offset: 9 },
    { name: 'DE | Drama', size: 24, offset: 12 },
    { name: 'DE | Komödie', size: 22, offset: 15 },
    { name: 'DE | Horror', size: 20, offset: 18 },
    { name: 'DE | Doku & Reportage', size: 18, offset: 21 },
    { name: 'DE | Kinder & Familie', size: 20, offset: 24 },
    { name: 'DE | 4K UHD Filme', size: 20, offset: 27 },
    { name: 'DE | Klassiker', size: 18, offset: 30 },
    { name: 'DE | Filmreihen & Boxsets', size: 24, offset: 33 },
    { name: 'EN | New Movies', size: 26, offset: 36 },
    { name: 'EN | Action', size: 24, offset: 39 },
    { name: 'EN | Drama & Romance', size: 22, offset: 42 },
    { name: 'TR | Filmler', size: 22, offset: 45 },
    { name: 'FR | Films', size: 20, offset: 48 },
    { name: 'ES | Películas', size: 20, offset: 51 },
    { name: 'IT | Film', size: 18, offset: 54 },
];

// Which shows go into which row, and how many seasons/episodes each carries.
// Consecutive indices step through the five covers in turn, so every row shows
// all five. Each show has exactly one home row — a show listed twice is merged
// by the parser into a single tile in whichever row carries more episodes, and
// disappears from the other one. Show 0 is listed twice on purpose, as a live
// check that the cross-category merge still works.
const SERIES_CATEGORIES = [
    { name: 'DE | Serien Neu 2026', shows: [0, 1, 2, 3, 4, 5, 6, 7], seasons: 2, episodes: 8 },
    { name: 'DE | Serien Drama', shows: [8, 9, 10, 11, 12, 13], seasons: 3, episodes: 6 },
    { name: 'DE | Serien Crime', shows: [14, 15, 16, 17, 18, 19], seasons: 2, episodes: 10 },
    { name: 'DE | Anime & Animation', shows: [20, 21, 22, 23], seasons: 2, episodes: 6 },
    { name: 'EN | Series', shows: [24, 25, 26, 27], seasons: 2, episodes: 8 },
    { name: 'TR | Diziler', shows: [28, 29, 0], seasons: 1, episodes: 12 },
];

// ---------------------------------------------------------------------------
// Live section. The curated channels come in with a country group already
// attached; a handful of the German ones get split further so the Live tab
// shows several rows instead of one long block.
// ---------------------------------------------------------------------------
const DE_SUBGROUPS = [
    [/^(Das Erste|ZDF|3sat|ARTE|ONE|ZDFneo|ARD Alpha)$/i, 'DE | Vollprogramm'],
    [/^(Tagesschau24|Welt|Phoenix|ZDFinfo)$/i, 'DE | Nachrichten'],
    [/DELUXE|SCHLAGER/i, 'DE | Musik'],
    [/^(KiKa)$/i, 'DE | Kinder'],
    [/^(BR |HR|MDR|NDR|RBB|SR$|SWR|WDR|Radio Bremen)/i, 'DE | Regional'],
];

const UK_SUBGROUPS = [
    [/^QVC/i, 'UK | Shopping'],
    [/^Now /i, 'UK | Musik'],
];

// The five source films under their real titles and years, in the order of
// VIDEOS above, so each entry streams the film it names.
const OPEN_MOVIES = [
    { title: 'Big Buck Bunny', year: 2008 },
    { title: 'Sintel', year: 2010 },
    { title: 'Elephants Dream', year: 2006 },
    { title: 'Tears of Steel', year: 2012 },
    { title: 'Cosmos Laundromat', year: 2015 },
];

const EPG_FEEDS = [
    'DE1', 'AT1', 'CH1', 'UK1', 'US1', 'FR1', 'IT1', 'ES1', 'GR1', 'JP1', 'KR1', 'SA1',
].map((code) => `https://epgshare01.online/epgshare01/epg_ripper_${code}.xml.gz`);

// ---------------------------------------------------------------------------
const slugify = (value) => value
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const posterUrl = (brand, index) => `${BASE}/covers/${brand}-${String((index % 16) + 1).padStart(2, '0')}.jpg`;

// The classifier marker described at the top of this file. It also makes every
// entry's URL unique, which keeps the parser's URL-level de-duplication from
// collapsing films that share the same demo video.
const movieStreamUrl = (video, slug) => `${video.url}?nfsrc=/movie/${slug}.mp4`;
const episodeStreamUrl = (video, showSlug, season, episode) =>
    `${video.url}?nfsrc=/series/${showSlug}/s${String(season).padStart(2, '0')}e${String(episode).padStart(2, '0')}.mp4`;

// Flat pool of 80 films: sixteen per cover, each with its own poster path.
const buildMoviePool = () => {
    const pool = [];
    for (let i = 0; i < 16; i++) {
        BRANDS.forEach((brand) => {
            const [title, year] = MOVIE_TITLES[brand][i];
            const slug = slugify(title);
            const video = VIDEOS[pool.length % VIDEOS.length];
            pool.push({
                id: `mv-${String(pool.length + 1).padStart(4, '0')}`,
                title: `${title} (${year})`,
                brand,
                posterIndex: i,
                url: movieStreamUrl(video, slug),
                minutes: video.minutes,
            });
        });
    }
    return pool;
};

// Flat pool of 30 shows, six per cover.
const buildSeriesPool = () => {
    const pool = [];
    for (let i = 0; i < 7; i++) {
        BRANDS.forEach((brand) => {
            const title = SERIES_TITLES[brand][i];
            pool.push({
                title,
                slug: slugify(title),
                brand,
                posterIndex: (i * 2) % 16,
            });
        });
    }
    return pool;
};

const lines = [];
const push = (line) => lines.push(line);

const extinf = ({ duration = -1, id, name, logo, group, tvgName }) => {
    const attrs = [
        `tvg-id="${id}"`,
        `tvg-name="${tvgName || name}"`,
        `tvg-logo="${logo}"`,
        `group-title="${group}"`,
    ].join(' ');
    return `#EXTINF:${duration} ${attrs},${name}`;
};

const main = () => {
    const movies = buildMoviePool();
    const shows = buildSeriesPool();
    const liveChannels = JSON.parse(readFileSync(new URL('../live-channels.json', import.meta.url), 'utf8'));

    push(`#EXTM3U x-tvg-url="${EPG_FEEDS.join(',')}"`);

    // --- Live -------------------------------------------------------------
    const regroup = (channel) => {
        const rules = channel.group.startsWith('DE |') ? DE_SUBGROUPS
            : channel.group.startsWith('UK |') ? UK_SUBGROUPS
                : [];
        for (const [pattern, group] of rules) {
            if (pattern.test(channel.name)) return group;
        }
        return channel.group;
    };

    const liveByGroup = new Map();
    liveChannels.forEach((channel) => {
        const group = regroup(channel);
        if (!liveByGroup.has(group)) liveByGroup.set(group, []);
        liveByGroup.get(group).push(channel);
    });

    // Germany first, then the rest alphabetically — the same order a
    // German-facing provider list would use.
    const liveGroupNames = [...liveByGroup.keys()].sort((a, b) => {
        const rank = (name) => (name.startsWith('DE |') ? 0 : 1);
        return rank(a) - rank(b) || a.localeCompare(b, 'de');
    });

    let liveIndex = 0;
    liveGroupNames.forEach((group) => {
        liveByGroup.get(group).forEach((channel) => {
            liveIndex += 1;
            push(extinf({
                id: channel.tvgId || `live-${liveIndex}`,
                name: channel.name,
                tvgName: channel.tvgName || channel.name,
                logo: channel.logo,
                group,
            }));
            push(channel.url);
        });
    });

    // --- Films ------------------------------------------------------------
    MOVIE_CATEGORIES.forEach((category) => {
        for (let i = 0; i < category.size; i++) {
            // offset shifts each row into a different slice of the pool, so the
            // rows overlap the way a real catalogue does (a film sits in
            // "New" and in its genre row) without any two rows being equal.
            const movie = movies[(category.offset * 5 + i) % movies.length];
            push(extinf({
                id: `${movie.id}-${slugify(category.name)}`,
                name: movie.title,
                logo: posterUrl(movie.brand, movie.posterIndex),
                group: category.name,
            }));
            push(movie.url);
        }
    });

    // The five films under their real names. Everything else in this playlist
    // is invented, which means the app finds no metadata for it and the
    // top-of-page preview stays empty — it needs at least a few titles it can
    // match against a metadata provider. These five are the actual videos
    // being streamed, so the match is honest: real poster, real synopsis, real
    // cast, and the hero, the rating badges and "ähnliche Titel" have
    // something to work with.
    OPEN_MOVIES.forEach((movie, i) => {
        const video = VIDEOS[i % VIDEOS.length];
        push(extinf({
            id: `om-${i + 1}`,
            name: `${movie.title} (${movie.year})`,
            logo: posterUrl(BRANDS[i % BRANDS.length], i),
            group: 'DE | Open Movies (CC-BY)',
        }));
        push(movieStreamUrl(video, slugify(movie.title)));
    });

    // Format sampler — one row that walks the player paths on purpose.
    FORMAT_STREAMS.forEach((stream, i) => {
        push(extinf({
            id: `fmt-${i + 1}`,
            name: stream.title,
            logo: posterUrl(stream.brand, i),
            group: 'DE | VOD Test-Streams',
        }));
        push(stream.url.includes('?') ? stream.url : `${stream.url}?nfsrc=/movie/format-test-${i + 1}.mp4`);
    });

    // --- Series -----------------------------------------------------------
    SERIES_CATEGORIES.forEach((category) => {
        category.shows.forEach((showIndex) => {
            const show = shows[showIndex % shows.length];
            for (let season = 1; season <= category.seasons; season++) {
                for (let episode = 1; episode <= category.episodes; episode++) {
                    const flat = (season - 1) * category.episodes + (episode - 1);
                    const video = VIDEOS[(showIndex + flat) % VIDEOS.length];
                    const episodeName = EPISODE_NAMES[flat % EPISODE_NAMES.length];
                    const seasonTag = `S${String(season).padStart(2, '0')}`;
                    const episodeTag = `E${String(episode).padStart(2, '0')}`;
                    push(extinf({
                        id: `sr-${show.slug}-${seasonTag}${episodeTag}-${slugify(category.name)}`,
                        name: `${show.title} ${seasonTag} ${episodeTag} - ${episodeName}`,
                        logo: posterUrl(show.brand, show.posterIndex),
                        group: category.name,
                    }));
                    push(episodeStreamUrl(video, show.slug, season, episode));
                }
            }
        });
    });

    // German season/episode wording, so the other branch of the episode parser
    // gets exercised too ("Staffel 1 Folge 1" instead of "S01 E01"). Uses a show
    // that appears in no other row, otherwise the merge would empty this one.
    const germanShow = shows[30];
    for (let episode = 1; episode <= 8; episode++) {
        push(extinf({
            id: `sr-de-${germanShow.slug}-f${episode}`,
            name: `${germanShow.title} Staffel 1 Folge ${episode} - ${EPISODE_NAMES[episode]}`,
            logo: posterUrl(germanShow.brand, germanShow.posterIndex),
            group: 'DE | Serien mit Staffel-Schreibweise',
        }));
        push(episodeStreamUrl(VIDEOS[episode % VIDEOS.length], `${germanShow.slug}-de`, 1, episode));
    }

    // A whole season as one entry — the shape some providers use instead of
    // listing episodes. The parser folds the three season entries of a show
    // back into a single tile with a three-season list.
    [31, 32, 33].forEach((showIndex) => {
        const show = shows[showIndex];
        [1, 2, 3].forEach((season) => {
            push(extinf({
                id: `sr-box-${show.slug}-s${season}`,
                name: `${show.title} S0${season} (Komplette Staffel)`,
                logo: posterUrl(show.brand, show.posterIndex),
                group: 'DE | Serien Boxsets',
            }));
            push(`${VIDEOS[season % VIDEOS.length].url}?nfsrc=/series/${show.slug}-box/s0${season}.mp4`);
        });
    });

    const output = `${lines.join('\n')}\n`;
    writeFileSync(new URL('../playlist.m3u', import.meta.url), output);

    const entries = lines.filter((l) => l.startsWith('#EXTINF')).length;
    console.error(`playlist.m3u: ${entries} entries, ${output.length} bytes, base=${BASE}`);
};

main();
