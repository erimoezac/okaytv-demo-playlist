#!/usr/bin/env node
// Picks the live channels for the OkayIPTV demo playlist out of the
// Free-TV/IPTV community list (https://github.com/Free-TV/IPTV).
//
// Two filters run here, and both exist for the same reason: the demo list
// has to be defensible. First a host allowlist — only streams served from a
// broadcaster's own CDN or from a licensed FAST platform (Wurl, Xumo, Amagi,
// Rakuten, Plex, Pluto, Google DAI) survive, so nothing in the output is a
// re-stream of somebody else's signal. Second a reachability probe, because a
// dead channel in a demo playlist reads as "the app is broken".
//
// Output: live-channels.json, consumed by build-playlist.mjs.

import { writeFileSync, readFileSync } from 'node:fs';

const SOURCE = 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8';

// Host patterns of official broadcaster CDNs and licensed FAST platforms.
// Matched as substrings against the stream hostname.
const ALLOWED_HOST_PATTERNS = [
    // German public broadcasting (ARD/ZDF and the regional networks). Each
    // ARD member runs its own Akamai property, hence the long list.
    'ard-mcdn.de', 'ard.de', 'daserste-live', 'zdf-hls', 'zdf.de',
    'mcdn.br.de', 'brcdn.vo.llnwd.net', 'swrbwd', 'swrrpd', 'wdrfs247',
    'ndr.de', 'ndrint', 'mdrtv', 'hrhls', 'rbb-hls', 'rbhlslive', 'srfs',
    'radiobremen', 'kikageohls', 'phoenix', 'tagesschau', 'w-live2weltcms',
    'artesimulcast', 'arte.tv',
    // Other European public broadcasters
    'rai.it', 'raiplay', 'francetv', 'france24', 'rfi.fr', 'ftven.fr',
    'nrk.no', 'svt.se', 'yle.fi', 'dr.dk', 'rtve.es', 'rtp.pt', 'vrt.be',
    'npo.nl', 'nponews', 'nos.nl', 'ert.gr', 'antennaplus.gr',
    'trt.com.tr', 'medya.trt', 'tvpstream', 'tvp.pl',
    'bbci.co.uk', 'bbc.co.uk', 'as-hls-ww-live', 'vs-hls-push',
    'channel4', 'itv.com', 'rtvelivestream', 'ebs.co.kr',
    // Commercial broadcasters streaming from their own infrastructure
    'mediaset.net', 'tv5monde', '9now-livestreams', 'rcavlive', 'qvcuk-live',
    'yospace.com', 'bcovlive',
    // International news broadcasters on their own CDNs
    'dwamdstream', 'dwstream', 'dw.com', 'getaj.net', 'aljazeera',
    'cgtn.com', 'nhk.or.jp', 'nhkworld', 'i24news', 'euronews',
    'abc.net.au', 'cbc.ca', 'cbcnews', 'bloomberg.com',
    'qatartv.akamaized.net', 'alarabiya', 'mbc1-enc', 'aljazeera',
    // Licensed FAST / AVOD platforms
    'wurl.tv', 'xumo.com', 'amagi.tv', 'amagi.com', 'rakuten.tv',
    'plex.tv', 'pluto.tv', 'samsung', 'dai.google.com', 'redbull',
    'rbmn-live', 'tubi', 'roku', 'vevo', 'crackle',
    // Space agencies / government (public domain or explicitly free feeds)
    'nasa', 'akamaized.net/hls/live/2013', 'c-span',
    // Music channels licensed for open distribution
    '3qsdn.com', 'qello', 'stingray',
];

// Never ship these, whatever the host says: EU-sanctioned outlets and
// user-generated relays (YouTube/Twitch wrappers) that the app can't play.
const BLOCKED_PATTERNS = [
    'youtube.com', 'youtu.be', 'twitch.tv', 'ythls', 'dailymotion',
    'rt.com', 'russiatoday', 'sputnik', 'rtarabic',
];

const BLOCKED_NAME_PATTERNS = [
    /\brt\b/i, /russia\s*today/i, /sputnik/i, /\bxxx\b/i, /adult/i, /erotic/i,
];

// Country/genre routing for the demo playlist's own group names. The leading
// token is what OkayIPTV's language filter and its public-EPG country
// detection both read, so it has to be a code the app knows.
const COUNTRY_GROUP = {
    Germany: 'DE | TV Sender',
    Austria: 'AT | TV Sender',
    Switzerland: 'CH | TV Sender',
    UK: 'UK | TV Channels',
    USA: 'US | TV Channels',
    France: 'FR | Chaînes TV',
    Italy: 'IT | Canali TV',
    Spain: 'ES | Canales TV',
    Netherlands: 'NL | TV Zenders',
    Poland: 'PL | Kanały TV',
    Turkey: 'TR | TV Kanalları',
    Greece: 'GR | Κανάλια',
    Portugal: 'PT | Canais TV',
    Norway: 'NO | TV Kanaler',
    Denmark: 'DK | TV Kanaler',
    Sweden: 'SE | TV Kanaler',
    Belgium: 'BE | TV Zenders',
    Canada: 'CA | TV Channels',
    Australia: 'AU | TV Channels',
    Ireland: 'IE | TV Channels',
    '日本 / Japan': 'JP | テレビ',
    Korea: 'KR | TV',
    China: 'CN | TV',
    India: 'IN | TV Channels',
    Qatar: 'AR | قنوات',
    'Saudi Arabia': 'AR | قنوات',
    'United Arab Emirates': 'AR | قنوات',
    Egypt: 'AR | قنوات',
    News: 'EN | News',
    'News (AR)': 'AR | أخبار',
    'News (ES)': 'ES | Noticias',
    'Documentaries (EN)': 'EN | Doku & Wissen',
    Business: 'EN | Business',
    Weather: 'EN | Wetter & Verkehr',
};

const parsePlaylist = (text) => {
    const lines = text.split(/\r?\n/);
    const out = [];
    let current = null;
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith('#EXTINF:')) {
            const commaIndex = line.indexOf(',', line.indexOf('"') > -1 ? line.lastIndexOf('"') : 0);
            const attrBlock = line.slice(0, commaIndex);
            const title = line.slice(commaIndex + 1).trim();
            const attrs = {};
            for (const m of attrBlock.matchAll(/([a-zA-Z0-9_-]+)="([^"]*)"/g)) attrs[m[1].toLowerCase()] = m[2];
            current = { title, attrs };
            continue;
        }
        if (line.startsWith('#')) continue;
        if (current) {
            current.url = line;
            out.push(current);
            current = null;
        }
    }
    return out;
};

const hostOf = (url) => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } };

// Free-TV marks the stream's origin with a circled letter in the title
// (Ⓨ YouTube, Ⓣ Twitch, Ⓖ geo-restricted, Ⓢ …). Those markers are noise in
// a product demo, so they get stripped from the visible name.
const cleanName = (name) => name
    .replace(/[ⓈⓉⓊⓋⓌⓍⓎⓏⒼ]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

// Two attempts: a single timeout on a busy CDN is not evidence that a
// channel is dead, and dropping a working channel costs the demo more than
// one extra request costs us.
const probe = async (url, attempts = 2) => {
    for (let i = 0; i < attempts; i++) {
        if (await probeOnce(url)) return true;
    }
    return false;
};

const probeOnce = async (url) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            redirect: 'follow',
            headers: { 'User-Agent': 'VLC/3.0.20 LibVLC/3.0.20' },
        });
        if (!res.ok) return false;
        const body = await res.text();
        return body.includes('#EXTM3U');
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
};

const mapWithConcurrency = async (items, limit, fn) => {
    const results = new Array(items.length);
    let cursor = 0;
    const workers = Array.from({ length: limit }, async () => {
        while (cursor < items.length) {
            const index = cursor++;
            results[index] = await fn(items[index], index);
        }
    });
    await Promise.all(workers);
    return results;
};

const main = async () => {
    const cacheArg = process.argv.find((a) => a.startsWith('--cache='));
    let text;
    if (cacheArg) {
        text = readFileSync(cacheArg.slice('--cache='.length), 'utf8');
    } else {
        const res = await fetch(SOURCE);
        text = await res.text();
    }

    const entries = parsePlaylist(text);
    const candidates = [];
    const seenUrl = new Set();

    for (const entry of entries) {
        const group = entry.attrs['group-title'] || '';
        const target = COUNTRY_GROUP[group];
        if (!target) continue;
        // A couple of entries still carry plain http. The app proxies every
        // stream anyway, but an https origin avoids a needless extra hop and
        // keeps the list usable outside the app too. All of these hosts are
        // Akamai properties and answer on https.
        const url = (entry.url || '').replace(/^http:\/\/(?=[^/]*\.akamaized\.net|[^/]*\.akamaihd\.net)/, 'https://');
        if (!url.includes('.m3u8')) continue;
        const lowerUrl = url.toLowerCase();
        if (BLOCKED_PATTERNS.some((p) => lowerUrl.includes(p))) continue;
        const name = cleanName(entry.title);
        if (!name) continue;
        if (BLOCKED_NAME_PATTERNS.some((re) => re.test(name))) continue;
        const host = hostOf(url);
        if (!ALLOWED_HOST_PATTERNS.some((p) => host.includes(p) || lowerUrl.includes(p))) continue;
        if (seenUrl.has(url)) continue;
        seenUrl.add(url);
        candidates.push({
            name,
            group: target,
            tvgId: entry.attrs['tvg-id'] || '',
            tvgName: cleanName(entry.attrs['tvg-name'] || name),
            logo: entry.attrs['tvg-logo'] || '',
            url,
        });
    }

    console.error(`candidates: ${candidates.length}`);
    const alive = await mapWithConcurrency(candidates, 12, async (c) => (await probe(c.url) ? c : null));
    const kept = alive.filter(Boolean);
    console.error(`reachable: ${kept.length}`);

    const byGroup = new Map();
    for (const channel of kept) {
        if (!byGroup.has(channel.group)) byGroup.set(channel.group, []);
        byGroup.get(channel.group).push(channel);
    }
    for (const [group, list] of byGroup) console.error(`  ${group}: ${list.length}`);

    writeFileSync(new URL('../live-channels.json', import.meta.url), `${JSON.stringify(kept, null, 2)}\n`);
};

main();
