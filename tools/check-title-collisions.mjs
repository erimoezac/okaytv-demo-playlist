#!/usr/bin/env node
// Prüft, ob ein Titel dieser Playlist bei einem Metadaten-Anbieter auf einen
// ECHTEN Film trifft.
//
// Warum das nötig ist: OkayIPTV sucht nicht nur nach dem vollen Namen. Es
// zerlegt ihn an ":" und "–" und fragt jeden Teil einzeln nach —
// "Northbound – Weißes Rauschen" wird zu ["Northbound Weißes Rauschen",
// "Weißes Rauschen", "Northbound"]. Der mittlere Teil traf den Netflix-Film
// "White Noise"; ab da hingen dessen Poster und dessen Inhaltsangabe an einem
// Demo-Eintrag, hinter dem ein Blender-Kurzfilm läuft. Für eine Playlist, die
// gerade wegen ihrer Rechtefreiheit existiert, ist das der schlimmste Fehler,
// den sie machen kann.
//
// Der erste Gedanke war, die Titel so zu wählen, dass kein Bestandteil einen
// echten Film trifft. Dieses Skript hat gezeigt, dass das nicht geht: von 345
// Titeln kollidierten 111 — TMDB führt zu fast jedem Wort irgendeine Doku,
// einen Kurzfilm oder eine Fernsehproduktion. Auch die Markennamen selbst
// ("Iron Dawn", "Only Forever") sind darunter.
//
// Gelöst ist es deshalb eine Ebene höher: OkayIPTV fragt für einen Eintrag, der
// Cover, Titelbild und Beschreibung selbst mitbringt, gar keinen
// Metadaten-Anbieter mehr (hasCuratedPlaylistArtwork in metadataService.js).
// Die Playlist liefert alle drei Felder, also ist keiner der 111 Treffer für
// OkayIPTV noch erreichbar.
//
// Dieses Skript bleibt trotzdem nützlich — als BERICHT, nicht als Prüfung. Es
// beantwortet die Frage "welche Titel würden in einem fremden Player, der
// eigene Metadaten nachschlägt, fremdes Material anziehen?". Es läuft deshalb
// bewusst ohne Fehler-Exitcode: eine Liste, die niemand auf null bringen kann,
// wäre als Ampel wertlos.
//
// Usage: node tools/check-title-collisions.mjs [--host=https://okaytv.app]

import { MOVIE_TITLES, SERIES_TITLES, BRANDS } from './titles.mjs';

const hostArg = process.argv.find((a) => a.startsWith('--host='));
const HOST = (hostArg ? hostArg.slice('--host='.length) : 'https://okaytv.app').replace(/\/+$/, '');

// Spiegelt buildTitleSearchVariants aus src/utils/metaMatch.js: der volle Name
// plus jeder Teil links und rechts eines ":" oder eines Gedankenstrichs. Eine
// römische Fortsetzungsziffer ("Neon Harbor II – Tiefgang") hängt am linken
// Teil und macht daraus keinen eigenen Kandidaten.
const buildVariants = (title) => {
    const full = String(title || '').replace(/\s*\(\d{4}\)\s*$/, '').trim();
    if (!full) return [];
    const parts = full.split(/\s*[:–—-]\s+|\s+[–—-]\s*/).map((p) => p.trim()).filter(Boolean);
    return [...new Set([full, ...parts])].filter((v) => v.length >= 4);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// cover=1 ist das LOCKERSTE Gate, das die App kennt (Top-Relevanz-Treffer
// genügt, kein Jahresabgleich). Wer hier nichts findet, findet auch auf den
// strengeren Wegen nichts — die Prüfung ist damit bewusst pessimistisch.
const lookup = async (query, type) => {
    const url = `${HOST}/tmdb-meta?query=${encodeURIComponent(query)}&type=${type}&cover=1`;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const payload = await response.json();
            if (payload?.configured === false) throw new Error('TMDB-Proxy nicht konfiguriert');
            return payload?.meta || null;
        } catch (error) {
            if (attempt === 2) throw error;
            await sleep(1500 * (attempt + 1));
        }
    }
    return null;
};

const main = async () => {
    // Marken-Eigennamen ("Northbound", "Iron Dawn") tauchen in jedem Titel der
    // Familie auf; sie werden einmal geprüft statt sechzehnmal.
    const queries = new Map();
    const remember = (variant, type, source) => {
        const key = `${type}:${variant.toLowerCase()}`;
        if (!queries.has(key)) queries.set(key, { variant, type, sources: [] });
        queries.get(key).sources.push(source);
    };

    BRANDS.forEach((brand) => {
        (MOVIE_TITLES[brand] || []).forEach(([title]) => {
            buildVariants(title).forEach((v) => remember(v, 'movie', title));
        });
        (SERIES_TITLES[brand] || []).forEach((title) => {
            buildVariants(title).forEach((v) => remember(v, 'series', title));
        });
    });

    const all = [...queries.values()];
    console.error(`${all.length} eindeutige Suchbegriffe werden geprüft (${HOST})`);

    const hits = [];
    // Vier gleichzeitig: schnell genug für ~400 Begriffe, langsam genug, dass
    // der Proxy nicht in sein 429 läuft und alles als "kein Treffer" ausgibt —
    // was die Prüfung stillschweigend wertlos machen würde.
    const CONCURRENCY = 4;
    let cursor = 0;
    let done = 0;
    const worker = async () => {
        while (cursor < all.length) {
            const entry = all[cursor++];
            const meta = await lookup(entry.variant, entry.type);
            done += 1;
            if (done % 25 === 0) console.error(`  ${done}/${all.length}`);
            if (meta) {
                hits.push({
                    variant: entry.variant,
                    type: entry.type,
                    match: meta.name,
                    year: meta.year || meta.releaseInfo || '?',
                    tmdbId: meta.tmdbId,
                    sources: [...new Set(entry.sources)],
                });
            }
        }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));

    if (hits.length === 0) {
        console.log('Keine Kollision: kein Titelbestandteil trifft einen echten Film.');
        return;
    }

    hits.sort((a, b) => a.variant.localeCompare(b.variant, 'de'));
    console.log(`${hits.length} von ${all.length} Suchbegriffen treffen einen echten Titel.\n`);
    hits.forEach((hit) => {
        console.log(`  "${hit.variant}" (${hit.type})`);
        console.log(`      trifft: ${hit.match} (${hit.year}, tmdb:${hit.tmdbId})`);
        console.log(`      steckt in: ${hit.sources.join(', ')}`);
    });
    console.log('\nFür OkayIPTV folgenlos: die Playlist liefert Cover, Titelbild und');
    console.log('Beschreibung selbst, und dafür fragt die App keinen Anbieter mehr.');
    console.log('Relevant nur für fremde Player, die eigene Metadaten nachschlagen.');
};

main().catch((error) => {
    console.error(`Prüfung abgebrochen: ${error.message}`);
    process.exitCode = 2;
});
