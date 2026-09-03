// Die Titel-, Marken- und Artwork-Tabellen der Demo-Playlist.
//
// Sie stehen in einer eigenen Datei, weil zwei Werkzeuge sie brauchen und
// keines von beiden die Wahrheit des anderen sein darf:
//   * tools/build-playlist.mjs schreibt daraus playlist.m3u
//   * tools/check-title-collisions.mjs prueft sie gegen einen Metadaten-
//     Anbieter, damit kein Titelbestandteil einen echten Film trifft
// Frueher lagen sie nur im Generator; eine Pruefung haette ihn importieren und
// damit jedes Mal die Playlist neu schreiben muessen.

// ---------------------------------------------------------------------------
// The covers, and the title family that belongs to each of them. The titles
// have to stay inside their family: the brand name is printed on the artwork,
// so "Ashes of Tomorrow" under the Neon Harbor poster would read as a broken
// list rather than a demo one.
//
// Ein zweiter, genauso harter Grund bestimmt die Titel — siehe den Block über
// TITLE_COLLISION_NOTES weiter unten: kein Titelbestandteil darf für sich
// genommen ein echter Filmtitel sein.
// ---------------------------------------------------------------------------
export const BRANDS = [
    'northbound', 'midnight-circuit', 'silent-atlas', 'ashes-of-tomorrow', 'neon-harbor',
    'after-the-fall', 'beyond-horizons', 'crimson-files', 'eclipse-protocol', 'iron-dawn',
    'neon-district', 'northland-saga', 'only-forever', 'realms-awakened', 'shattered-lies',
];

// Titelbild, freigestelltes Titel-Logo und Kurzbeschreibung je Marke. Die App
// liest sie über tvg-backdrop / tvg-titlelogo / tvg-plot und baut daraus den
// Hero auf der Startseite — ohne dass sie einen Metadaten-Treffer braucht.
// Drei der fünf ältesten Marken haben kein Titel-Logo; für die rendert der Hero
// den Titel als Text, was genauso vorgesehen ist.
export const BRAND_ARTWORK = {
    northbound: {
        logo: 'northbound',
        plot: 'Ein Fahrer bringt einen Konvoi über die letzte offene Passstraße nach Norden, bevor der Winter sie für Monate schließt. Als der Funk abreißt, wird aus der Route eine Frage von Vertrauen — und aus dem Wetter der kleinste seiner Gegner.',
    },
    'midnight-circuit': {
        logo: 'midnight-circuit',
        plot: 'In einer Stadt, die jede Bewegung protokolliert, sucht ein Ermittler nach einer Nacht, die aus allen Aufzeichnungen verschwunden ist. Je näher er kommt, desto klarer wird: Das System vergisst nichts — es wurde gebeten, sich zu erinnern.',
    },
    'silent-atlas': {
        logo: null,
        plot: 'Eine alte Seekarte führt an eine Küste, die auf keiner heutigen Karte steht. Was als Expedition beginnt, wird zur Suche nach den Leuten, die dort einmal gelebt haben — und nach dem Grund, warum niemand ihre Spuren aufschreiben wollte.',
    },
    'ashes-of-tomorrow': {
        logo: null,
        plot: 'Jahre nach dem Ende sammelt eine Überlebende ein, was von den Städten übrig ist: Werkzeuge, Namen, Erinnerungen. Als aus dem Süden ein Funkspruch kommt, muss sie entscheiden, ob die Zukunft ein Ort ist, zu dem man zurückgeht.',
    },
    'neon-harbor': {
        logo: null,
        plot: 'Zwei Ermittler, ein Hafen, eine Leiche zwischen den Containern. Ihre Fälle laufen auf dieselbe Reederei zu — und auf eine Nachtschicht, in der beide entscheiden müssen, wem im Revier sie noch trauen.',
    },
    'after-the-fall': {
        logo: 'after-the-fall',
        plot: 'Dreißig Jahre nachdem die Städte leer wurden, wächst zwischen den Hochhäusern ein Wald. Ein Kundschafter soll herausfinden, wer die Signale sendet, die seit dem Frühjahr aus dem alten Zentrum kommen — und was aus denen wurde, die nie gegangen sind.',
    },
    'beyond-horizons': {
        logo: 'beyond-horizons',
        plot: 'Eine Vermesserin zieht allein durch ein Hochtal, das auf keiner Karte richtig eingezeichnet ist. Je weiter sie kommt, desto mehr wird aus der Arbeit eine Auseinandersetzung mit der Frage, warum sie überhaupt losgegangen ist.',
    },
    'crimson-files': {
        logo: 'crimson-files',
        plot: 'Eine Ermittlerin übernimmt einen Stapel Akten, den vor ihr drei Kollegen abgegeben haben. Die Fälle liegen Jahre auseinander und haben nichts gemeinsam — bis auf ein Detail, das in jedem Protokoll steht und das nie jemand aufgeschrieben haben wollte.',
    },
    'eclipse-protocol': {
        logo: 'eclipse-protocol',
        plot: 'Eine Forschungsstation am Rand des Sonnensystems meldet sich nach acht Monaten Funkstille zurück — mit Daten, die niemand bestellt hat. Das Team, das nachsehen soll, findet eine Anlage vor, die weiterlief, als wäre nie jemand weggewesen.',
    },
    'iron-dawn': {
        logo: 'iron-dawn',
        plot: 'Ein Bergungstrupp arbeitet sich durch eine Stadt, aus der die Front vor Wochen abgezogen ist. Ihr Auftrag lautet Material, ihre Listen füllen sich mit Namen — und irgendwann steht die Frage im Raum, wofür sie eigentlich noch aufräumen.',
    },
    'neon-district': {
        logo: 'neon-district',
        plot: 'In einem Viertel, in dem jede Tür einen Datensatz braucht, lebt jemand ohne einen. Ein Kurier soll ihn finden, bevor die Verwaltung es tut — und merkt dabei, dass die Lücke in den Akten kein Fehler ist, sondern jemandes Arbeit.',
    },
    'northland-saga': {
        logo: 'northland-saga',
        plot: 'Ein Schiffsführer kehrt nach zwei Wintern in eine Siedlung zurück, die ihn längst abgeschrieben hat. Was er mitbringt, reicht für den Frühling — was er verschweigt, entscheidet darüber, ob die Siedlung den nächsten Herbst erlebt.',
    },
    'only-forever': {
        logo: 'only-forever',
        plot: 'Zwei Menschen, die sich in einer fremden Stadt über den Weg laufen, geben sich einen Abend. Aus dem Abend wird ein Sommer, und aus dem Sommer die Frage, wer von beiden bereit ist, sein bisheriges Leben dafür anders zu erzählen.',
    },
    'realms-awakened': {
        logo: 'realms-awakened',
        plot: 'Ein Bote bringt eine Nachricht über ein Hochland, das seit Generationen keinen Herrscher mehr anerkennt. In jedem Tal wird ihm etwas anderes über den Krieg erzählt, den er ankündigen soll — und am Ende muss er entscheiden, welche Fassung er weiterträgt.',
    },
    'shattered-lies': {
        logo: 'shattered-lies',
        plot: 'Eine Anwältin erkennt in einer Zeugenaussage ihre eigene Kindheit wieder. Je sauberer sie den Fall führt, desto klarer wird, dass sie ihn nur gewinnen kann, wenn sie die Version aufgibt, mit der ihre Familie seit zwanzig Jahren lebt.',
    },
};

export const MOVIE_TITLES = {
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
        ['Northbound – Funkschatten', 2024], ['Northbound: Treibgut', 2022],
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
    'after-the-fall': [
        ['After the Fall', 2022], ['After the Fall: Stadtwald', 2024],
        ['After the Fall II – Dachgärten', 2025], ['After the Fall: Sendemast', 2026],
        ['After the Fall – Trinkwasser', 2023], ['After the Fall: Rankenwerk', 2021],
        ['After the Fall – Hochhausgrund', 2020], ['After the Fall: Saatgutkammer', 2019],
        ['After the Fall – Ringstraße', 2018], ['After the Fall: Wildwuchs', 2017],
        ['After the Fall – Nachbarschaft', 2016], ['After the Fall: Wasserturm', 2026],
        ['After the Fall – Baumgrenze', 2024], ['After the Fall: Straßenbahnschacht', 2022],
        ['After the Fall – Erntehelfer', 2025], ['After the Fall: Riesenrad', 2023],
    ],
    'beyond-horizons': [
        ['Beyond Horizons', 2023], ['Beyond Horizons: Talsperre', 2024],
        ['Beyond Horizons II – Rückenwind', 2025], ['Beyond Horizons: Steilufer', 2026],
        ['Beyond Horizons – Mittagshöhe', 2022], ['Beyond Horizons: Bergseen', 2021],
        ['Beyond Horizons – Wanderpass', 2020], ['Beyond Horizons: Flusslauf', 2019],
        ['Beyond Horizons – Gipfelbuch', 2018], ['Beyond Horizons: Weitblick', 2017],
        ['Beyond Horizons – Hochtal', 2016], ['Beyond Horizons: Abendlicht', 2026],
        ['Beyond Horizons – Kartenrand', 2024], ['Beyond Horizons: Nordhang', 2022],
        ['Beyond Horizons – Schneefeld', 2025], ['Beyond Horizons: Umkehrpunkt', 2023],
    ],
    'crimson-files': [
        ['Crimson Files', 2022], ['Crimson Files: Aktendeckel', 2024],
        ['Crimson Files II – Wandtafel', 2025], ['Crimson Files: Fadenkreuze', 2026],
        ['Crimson Files – Randnotiz', 2023], ['Crimson Files: Nachtschichten', 2021],
        ['Crimson Files – Zeugenliste', 2020], ['Crimson Files: Kaltfall', 2019],
        ['Crimson Files – Vermerkspalte', 2018], ['Crimson Files: Pinnwand', 2017],
        ['Crimson Files – Ablagekeller', 2016], ['Crimson Files: Registratur', 2026],
        ['Crimson Files – Namensregister', 2024], ['Crimson Files: Kartenausschnitt', 2022],
        ['Crimson Files – Wachbuch', 2025], ['Crimson Files: Aktenzeichen', 2023],
    ],
    'eclipse-protocol': [
        ['Eclipse Protocol', 2022], ['Eclipse Protocol: Funkstille', 2024],
        ['Eclipse Protocol II – Landefeld', 2025], ['Eclipse Protocol: Umlaufbahn', 2026],
        ['Eclipse Protocol – Schattenseite', 2023], ['Eclipse Protocol: Trockendock', 2021],
        ['Eclipse Protocol – Messreihe', 2020], ['Eclipse Protocol: Randstation', 2019],
        ['Eclipse Protocol – Kernschatten', 2018], ['Eclipse Protocol: Nachtseite', 2017],
        ['Eclipse Protocol – Bodenprobe', 2016], ['Eclipse Protocol: Rückflugfenster', 2026],
        ['Eclipse Protocol – Aussenposten', 2024], ['Eclipse Protocol: Sichtachse', 2022],
        ['Eclipse Protocol – Wartungsschacht', 2025], ['Eclipse Protocol: Sonnenwind', 2023],
    ],
    'iron-dawn': [
        ['Iron Dawn', 2022], ['Iron Dawn: Bergungstrupp', 2024],
        ['Iron Dawn II – Frontabschnitt', 2025], ['Iron Dawn: Materiallisten', 2026],
        ['Iron Dawn – Sammelstelle', 2023], ['Iron Dawn: Schutthalde', 2021],
        ['Iron Dawn – Feldlazarett', 2020], ['Iron Dawn: Nachschubweg', 2019],
        ['Iron Dawn – Räumkommando', 2018], ['Iron Dawn: Stellungswechsel', 2017],
        ['Iron Dawn – Brückenkopf', 2016], ['Iron Dawn: Panzergraben', 2026],
        ['Iron Dawn – Marschbefehl', 2024], ['Iron Dawn: Trümmerfeld', 2022],
        ['Iron Dawn – Sperrzone', 2025], ['Iron Dawn: Heimatpost', 2023],
    ],
    'neon-district': [
        ['Neon District', 2022], ['Neon District: Datensatz', 2024],
        ['Neon District II – Nachtschalter', 2025], ['Neon District: Kurierweg', 2026],
        ['Neon District – Lückenakte', 2023], ['Neon District: Meldeamt', 2021],
        ['Neon District – Leuchtreklame', 2020], ['Neon District: Sperrbezirk', 2019],
        ['Neon District – Wohnblock', 2018], ['Neon District: Regenstunde', 2017],
        ['Neon District – Nummernkreis', 2016], ['Neon District: Wartehalle', 2026],
        ['Neon District – Türcode', 2024], ['Neon District: Nachtbus', 2022],
        ['Neon District – Bildschirmwand', 2025], ['Neon District: Ausweiskontrolle', 2023],
    ],
    'northland-saga': [
        ['Northland Saga', 2022], ['Northland Saga: Winterlager', 2024],
        ['Northland Saga II – Ruderbank', 2025], ['Northland Saga: Schiffssteven', 2026],
        ['Northland Saga – Fjordmündung', 2023], ['Northland Saga: Handelsfahrt', 2021],
        ['Northland Saga – Thingplatz', 2020], ['Northland Saga: Salzfässer', 2019],
        ['Northland Saga – Küstenstreifen', 2018], ['Northland Saga: Eisrand', 2017],
        ['Northland Saga – Grabhügel', 2016], ['Northland Saga: Segeltuch', 2026],
        ['Northland Saga – Herbstopfer', 2024], ['Northland Saga: Nordmeer', 2022],
        ['Northland Saga – Siedlungsrat', 2025], ['Northland Saga: Frühjahrsfahrt', 2023],
    ],
    'only-forever': [
        ['Only Forever', 2022], ['Only Forever: Sommerhalbjahr', 2024],
        ['Only Forever II – Dachterrasse', 2025], ['Only Forever: Abendzug', 2026],
        ['Only Forever – Zwischenstopp', 2023], ['Only Forever: Postkartengruß', 2021],
        ['Only Forever – Wohnungsschlüssel', 2020], ['Only Forever: Regenschauer', 2019],
        ['Only Forever – Stadtplan', 2018], ['Only Forever: Frühstückstisch', 2017],
        ['Only Forever – Umzugskisten', 2016], ['Only Forever: Antwortbrief', 2026],
        ['Only Forever – Nachtspaziergang', 2024], ['Only Forever: Ferienwoche', 2022],
        ['Only Forever – Rückfahrkarte', 2025], ['Only Forever: Neujahrsmorgen', 2023],
    ],
    'realms-awakened': [
        ['Realms Awakened', 2022], ['Realms Awakened: Botengang', 2024],
        ['Realms Awakened II – Talschaften', 2025], ['Realms Awakened: Burgfrieden', 2026],
        ['Realms Awakened – Hochlandpass', 2023], ['Realms Awakened: Drachenhorst', 2021],
        ['Realms Awakened – Lehnsherren', 2020], ['Realms Awakened: Wappenrolle', 2019],
        ['Realms Awakened – Schwertgang', 2018], ['Realms Awakened: Grenzmark', 2017],
        ['Realms Awakened – Turmwache', 2016], ['Realms Awakened: Waldsaum', 2026],
        ['Realms Awakened – Kronrat', 2024], ['Realms Awakened: Wasserfälle', 2022],
        ['Realms Awakened – Nebelkuppe', 2025], ['Realms Awakened: Steinbrücke', 2023],
    ],
    'shattered-lies': [
        ['Shattered Lies', 2022], ['Shattered Lies: Zeugenstand', 2024],
        ['Shattered Lies II – Aktenlage', 2025], ['Shattered Lies: Familienrat', 2026],
        ['Shattered Lies – Vernehmung', 2023], ['Shattered Lies: Kindheitsjahre', 2021],
        ['Shattered Lies – Schriftsatz', 2020], ['Shattered Lies: Nachtaussage', 2019],
        ['Shattered Lies – Beweisstück', 2018], ['Shattered Lies: Verhandlungstag', 2017],
        ['Shattered Lies – Widerruf', 2016], ['Shattered Lies: Sitzungssaal', 2026],
        ['Shattered Lies – Rückblende', 2024], ['Shattered Lies: Glassplitter', 2022],
        ['Shattered Lies – Urteilsspruch', 2025], ['Shattered Lies: Randbemerkung', 2023],
    ],
};

// Series titles per cover. Deliberately free of the words the parser reads as
// season/episode markers (Season, Staffel, Sezon, Folge, Bölüm, …) — one of
// those inside a show's name would truncate the name at that word.
export const SERIES_TITLES = {
    northbound: ['Northbound', 'Northbound: Origins', 'Northbound – Die Küstenwache', 'Northbound: Cold Trail', 'Northbound – Grenzposten', 'Northbound: Weiße Wildnis', 'Northbound: Fährtenleser'],
    'midnight-circuit': ['Midnight Circuit', 'Midnight Circuit: Protokoll', 'Midnight Circuit – Datenspur', 'Midnight Circuit: Nachtschaltung', 'Midnight Circuit – Sektor Null', 'Midnight Circuit: Rauschen', 'Midnight Circuit – Kaltstart'],
    'silent-atlas': ['The Silent Atlas', 'The Silent Atlas: Expeditionen', 'The Silent Atlas – Kartenwerk', 'The Silent Atlas: Untiefen', 'The Silent Atlas – Randnotizen', 'The Silent Atlas: Windrose', 'The Silent Atlas: Passatwinde'],
    'ashes-of-tomorrow': ['Ashes of Tomorrow', 'Ashes of Tomorrow: Aftermath', 'Ashes of Tomorrow – Flugasche', 'Ashes of Tomorrow: Notruf', 'Ashes of Tomorrow – Trümmerpfad', 'Ashes of Tomorrow: Neuland', 'Ashes of Tomorrow – Wüstenlauf'],
    'neon-harbor': ['Neon Harbor', 'Neon Harbor: Reviermeldung', 'Neon Harbor – Kaischuppen', 'Neon Harbor: Nachtstreife', 'Neon Harbor – Hafenkrimi', 'Neon Harbor: Flutlicht', 'Neon Harbor: Hafenmeister'],
    'after-the-fall': ['After the Fall', 'After the Fall: Stadtgrün', 'After the Fall – Wasserläufe', 'After the Fall: Funkverkehr', 'After the Fall – Nachbarschaften', 'After the Fall: Saatgut', 'After the Fall: Rückbau'],
    'beyond-horizons': ['Beyond Horizons', 'Beyond Horizons: Vermessung', 'Beyond Horizons – Tagesetappen', 'Beyond Horizons: Höhenweg', 'Beyond Horizons – Kartenwerkstatt', 'Beyond Horizons: Talgrund', 'Beyond Horizons: Wetterfenster'],
    'crimson-files': ['Crimson Files', 'Crimson Files: Ermittlungsakten', 'Crimson Files – Wandprotokoll', 'Crimson Files: Zeugenaufrufe', 'Crimson Files – Ablagefach', 'Crimson Files: Kaltfälle', 'Crimson Files: Dienststelle'],
    'eclipse-protocol': ['Eclipse Protocol', 'Eclipse Protocol: Messdaten', 'Eclipse Protocol – Landeanflug', 'Eclipse Protocol: Bordbuch', 'Eclipse Protocol – Randstationen', 'Eclipse Protocol: Sonnenrand', 'Eclipse Protocol: Wartungsplan'],
    'iron-dawn': ['Iron Dawn', 'Iron Dawn: Bergungsdienst', 'Iron Dawn – Materialkunde', 'Iron Dawn: Namenslisten', 'Iron Dawn – Sammelplätze', 'Iron Dawn: Nachschub', 'Iron Dawn: Räumdienst'],
    'neon-district': ['Neon District', 'Neon District: Meldewesen', 'Neon District – Kurierdienste', 'Neon District: Türcodes', 'Neon District – Aktenlücken', 'Neon District: Nachtschalter', 'Neon District: Bezirksamt'],
    'northland-saga': ['Northland Saga', 'Northland Saga: Handelsfahrten', 'Northland Saga – Siedlungsrat', 'Northland Saga: Winterlager', 'Northland Saga – Küstenfahrt', 'Northland Saga: Fjordleute', 'Northland Saga: Ruderbänke'],
    'only-forever': ['Only Forever', 'Only Forever: Sommermonate', 'Only Forever – Zwischenstopps', 'Only Forever: Briefwechsel', 'Only Forever – Wohnungssuche', 'Only Forever: Ferienzeit', 'Only Forever: Nachtspaziergänge'],
    'realms-awakened': ['Realms Awakened', 'Realms Awakened: Botengänge', 'Realms Awakened – Talschaften', 'Realms Awakened: Wappenrollen', 'Realms Awakened – Turmwachen', 'Realms Awakened: Grenzmarken', 'Realms Awakened: Kronrat'],
    'shattered-lies': ['Shattered Lies', 'Shattered Lies: Verhandlungstage', 'Shattered Lies – Aktenlagen', 'Shattered Lies: Zeugenstände', 'Shattered Lies – Schriftsätze', 'Shattered Lies: Familienjahre', 'Shattered Lies: Beweisstücke'],
};
