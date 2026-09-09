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
//      one visible tile. Hence covers/<brand>-NN.jpg: every brand image is
//      copied to sixteen paths, so every film in a category carries its own
//      poster URL.
//
// Usage: node tools/build-playlist.mjs [--base=https://host/path]

import { readFileSync, writeFileSync } from 'node:fs';

// Marken, Titel und Artwork liegen in einer eigenen Datei, damit
// tools/check-title-collisions.mjs sie pruefen kann, ohne diesen Generator zu
// starten (und damit die Playlist zu ueberschreiben).
import { BRANDS, BRAND_ARTWORK, BRAND_FACTS, CAST_POOL, DIRECTOR_POOL, MOVIE_TITLES, SERIES_TITLES } from './titles.mjs';

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
// through every brand in order, so a row of 30 shows all fifteen twice.
// ---------------------------------------------------------------------------
// `brands` bindet eine Reihe an bestimmte Marken. Seit es Marken mit klarem
// Genre gibt (Horror, Animation, Mystery, Superhelden), wäre der reine
// Rundlauf ein sichtbarer Fehler: in „DE | Horror" stünden Kinderfilme.
//
// Das betrifft nur den Anbieter-Modus („Reihenfolge meines Anbieters"). Im
// Standard ordnet die App selbst ein, und zwar über tvg-genre — dafür musste
// sie erst lernen, dass eine Playlist ihr Genre mitbringen kann.
const MOVIE_CATEGORIES = [
    { name: 'DE | Neu im Katalog 2026', size: 30, offset: 0 },
    { name: 'DE | Action & Abenteuer', size: 30, offset: 3, brands: ['aurora-sentinel', 'nova-strike', 'shadow-vigil', 'northbound', 'iron-dawn', 'northland-saga'] },
    { name: 'DE | Thriller & Krimi', size: 28, offset: 6, brands: ['crimson-files', 'midnight-clue', 'fogline', 'neon-harbor', 'shattered-lies', 'the-hollow-key'] },
    { name: 'DE | Sci-Fi & Fantasy', size: 26, offset: 9, brands: ['eclipse-protocol', 'midnight-circuit', 'neon-district', 'after-the-fall', 'realms-awakened', 'ashes-of-tomorrow'] },
    { name: 'DE | Drama', size: 24, offset: 12 },
    { name: 'DE | Komödie', size: 22, offset: 15 },
    { name: 'DE | Horror', size: 20, offset: 18, brands: ['black-hollow', 'last-light-manor', 'the-weeping-pines'] },
    { name: 'DE | Doku & Reportage', size: 18, offset: 21 },
    { name: 'DE | Kinder & Familie', size: 20, offset: 24, brands: ['cosmo-crew', 'skygarden-voyage', 'night-critters', 'skypals', 'robo-und-nico', 'lanternwood'] },
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
// Consecutive indices step through the covers in turn, so a row never repeats a
// brand before it has used all of them. Each show has exactly one home row — a
// show listed twice is merged
// by the parser into a single tile in whichever row carries more episodes, and
// disappears from the other one. Show 0 is listed twice on purpose, as a live
// check that the cross-category merge still works.
const SERIES_CATEGORIES = [
    { name: 'DE | Serien Neu 2026', shows: [0, 1, 2, 3, 4, 5, 6, 7], seasons: 2, episodes: 8 },
    { name: 'DE | Serien Drama', shows: [8, 9, 10, 11, 12, 13], seasons: 3, episodes: 6 },
    { name: 'DE | Serien Crime', shows: [14, 15, 16, 17, 18, 19], seasons: 2, episodes: 10, brands: ['crimson-files', 'midnight-clue', 'fogline', 'neon-harbor', 'shadow-vigil', 'the-hollow-key'] },
    { name: 'DE | Anime & Animation', shows: [20, 21, 22, 23], seasons: 2, episodes: 6, brands: ['cosmo-crew', 'lanternwood', 'night-critters', 'skypals'] },
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

// ---------------------------------------------------------------------------
// Bewertung, Laufzeit und Besetzung je Titel.
//
// Deterministisch aus dem Titel abgeleitet statt gewürfelt: derselbe Titel
// bekommt bei jedem Bau dieselben Werte. Sonst wäre jeder Lauf ein kompletter
// Diff über 1056 Zeilen, und ein Tester, der zwei Stände vergleicht, könnte
// echte Änderungen nicht mehr von Rauschen unterscheiden.
// ---------------------------------------------------------------------------
const titelHash = (value) => {
    let hash = 2166136261;
    const text = String(value || '');
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash;
};

// Zwei Werte aus EINEM Hash brauchen unterschiedliche Bits — sonst laufen
// Bewertung und Laufzeit im Gleichschritt und jeder lange Film wäre auch der
// bestbewertete.
const streuung = (hash, schicht, spanne) => {
    const [von, bis] = spanne;
    const anteil = ((hash >>> (schicht * 7)) & 0xffff) / 0xffff;
    return von + anteil * (bis - von);
};

// Folgenlänge statt Spielfilmlänge. Ohne das stand unter jeder Episode die
// Laufzeit eines Kinofilms ("Iron Dawn S01 E01 · 123 min") — der eine Wert, an
// dem sofort auffällt, dass die Zahlen nicht zum Inhalt gehören.
const SERIEN_MINUTEN = [38, 58];

const faktenFuer = (brand, titel, { istFolge = false } = {}) => {
    const basis = BRAND_FACTS[brand];
    if (!basis) return null;
    const hash = titelHash(titel);
    const wertung = streuung(hash, 0, basis.wertung).toFixed(1);
    const minuten = Math.round(streuung(hash, 2, istFolge ? SERIEN_MINUTEN : basis.minuten));
    // Zwei Namen aus dem Pool, garantiert verschieden.
    const ersterName = hash % CAST_POOL.length;
    const zweiterName = (ersterName + 1 + ((hash >>> 8) % (CAST_POOL.length - 1))) % CAST_POOL.length;
    const dritterName = (zweiterName + 1 + ((hash >>> 16) % (CAST_POOL.length - 1))) % CAST_POOL.length;
    return {
        genres: basis.genres,
        age: basis.age,
        wertung,
        minuten,
        cast: [CAST_POOL[ersterName], CAST_POOL[zweiterName], CAST_POOL[dritterName]],
        director: DIRECTOR_POOL[(hash >>> 4) % DIRECTOR_POOL.length],
    };
};

// The classifier marker described at the top of this file. It also makes every
// entry's URL unique, which keeps the parser's URL-level de-duplication from
// collapsing films that share the same demo video.
const movieStreamUrl = (video, slug) => `${video.url}?nfsrc=/movie/${slug}.mp4`;
const episodeStreamUrl = (video, showSlug, season, episode) =>
    `${video.url}?nfsrc=/series/${showSlug}/s${String(season).padStart(2, '0')}e${String(episode).padStart(2, '0')}.mp4`;

// Flat pool of sixteen films per cover, each with its own poster path.
const buildMoviePool = () => {
    const pool = [];
    for (let i = 0; i < 16; i++) {
        BRANDS.forEach((brand) => {
            const [title, year] = MOVIE_TITLES[brand][i];
            const slug = slugify(title);
            const video = VIDEOS[pool.length % VIDEOS.length];
            // Only the recent half carries its year in the title. Provider
            // lists mix both spellings anyway, and here it also decides which
            // titles the app puts in front of its top-preview enrichment: that
            // pool is capped at 60 entries and sorted by year, descending.
            // With a year on all eighty, the five real films (2006–2015) never
            // reached it and the preview stayed empty — they are the only
            // titles in this playlist a metadata provider can actually match.
            const showYear = year >= 2020;
            pool.push({
                id: `mv-${String(pool.length + 1).padStart(4, '0')}`,
                title: showYear ? `${title} (${year})` : title,
                brand,
                posterIndex: i,
                url: movieStreamUrl(video, slug),
                minutes: video.minutes,
            });
        });
    }
    return pool;
};

// Flat pool of shows, seven per cover.
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

// `faktenTitel` steuert, aus welchem Titel Bewertung und Laufzeit abgeleitet
// werden. Bei Serien ist das der SHOW-Titel, nicht der Folgen-Titel: sonst
// bekäme jede Folge derselben Staffel eine andere Bewertung und eine andere
// Laufzeit, und die Serie sähe im Detail aus wie zwanzig fremde Filme.
const extinf = ({ duration = -1, id, name, logo, group, tvgName, brand = null, faktenTitel = null, istFolge = false }) => {
    const artwork = brand ? BRAND_ARTWORK[brand] : null;
    const fakten = brand ? faktenFuer(brand, faktenTitel || name, { istFolge }) : null;
    const attrs = [
        `tvg-id="${id}"`,
        `tvg-name="${tvgName || name}"`,
        `tvg-logo="${logo}"`,
        // Titelbild, Titel-Logo und Beschreibung für den Hero. Kein Standard,
        // aber die Schreibweise, die verbreitete Listen für Zusatz-Artwork
        // benutzen — Player, die sie nicht kennen, ignorieren sie folgenlos.
        ...(artwork ? [`tvg-backdrop="${BASE}/hero/${brand}.jpg"`] : []),
        ...(artwork?.logo ? [`tvg-titlelogo="${BASE}/logos/${artwork.logo}.png"`] : []),
        ...(artwork?.plot ? [`tvg-plot="${artwork.plot}"`] : []),
        // Die Werte der Infozeile im Detail. Ohne sie steht dort nichts, weil
        // diese Playlist bewusst keinen Metadaten-Anbieter mehr befragt.
        ...(fakten ? [
            `tvg-genre="${fakten.genres.join(', ')}"`,
            `tvg-age="${fakten.age}"`,
            `tvg-rating="${fakten.wertung}"`,
            `tvg-runtime="${fakten.minuten}"`,
            `tvg-cast="${fakten.cast.join(', ')}"`,
            `tvg-director="${fakten.director}"`,
        ] : []),
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
            // An Marken gebundene Reihe: nur deren Filme, sonst der Rundlauf
            // ueber den ganzen Pool wie bisher.
            const auswahl = category.brands
                ? movies.filter((m) => category.brands.includes(m.brand))
                : movies;
            const movie = auswahl[(category.offset * BRANDS.length + i) % auswahl.length];
            push(extinf({
                id: `${movie.id}-${slugify(category.name)}`,
                name: movie.title,
                logo: posterUrl(movie.brand, movie.posterIndex),
                group: category.name,
                brand: movie.brand,
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
        const showAuswahl = category.brands
            ? shows.filter((sh) => category.brands.includes(sh.brand))
            : shows;
        category.shows.forEach((showIndex) => {
            const show = showAuswahl[showIndex % showAuswahl.length];
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
                        brand: show.brand,
                        faktenTitel: show.title,
                        istFolge: true,
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
            brand: germanShow.brand,
            faktenTitel: germanShow.title,
            istFolge: true,
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
                brand: show.brand,
                faktenTitel: show.title,
            }));
            push(`${VIDEOS[season % VIDEOS.length].url}?nfsrc=/series/${show.slug}-box/s0${season}.mp4`);
        });
    });

    const output = `${lines.join('\n')}\n`;
    // Written under two names on purpose. OkayIPTV stores every playlist
    // response longer than 100 characters in the browser's CacheStorage under
    // its URL, and reads it back on the next login without re-fetching. Load
    // the list while GitHub Pages is mid-deploy and its 404 page (~9 KB) lands
    // in that slot — from then on the app parses an HTML error page, finds
    // zero channels and reports "Ungültiger Playlist-Inhalt" on every retry.
    // A second, identical file gives a stuck client a URL that no cache has
    // seen yet, without anyone having to clear browser storage.
    writeFileSync(new URL('../playlist.m3u', import.meta.url), output);
    writeFileSync(new URL('../okaytv-demo.m3u', import.meta.url), output);

    const entries = lines.filter((l) => l.startsWith('#EXTINF')).length;
    console.error(`playlist.m3u: ${entries} entries, ${output.length} bytes, base=${BASE}`);
};

main();
