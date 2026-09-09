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
    // Zweiter Schwung (09.09.2026) — er bringt dem Katalog die Genres, die ihm
    // bis dahin fehlten: Animation fuer Kinder, Horror, Mystery, Superhelden.
    'cosmo-crew', 'lanternwood', 'skygarden-voyage', 'night-critters', 'robo-und-nico',
    'skypals', 'black-hollow', 'last-light-manor', 'the-weeping-pines', 'fogline',
    'midnight-clue', 'the-hollow-key', 'aurora-sentinel', 'nova-strike', 'shadow-vigil',
];

// Titelbild, freigestelltes Titel-Logo und Kurzbeschreibung je Marke. Die App
// liest sie über tvg-backdrop / tvg-titlelogo / tvg-plot und baut daraus den
// Hero auf der Startseite — ohne dass sie einen Metadaten-Treffer braucht.
// Alle fünfzehn haben inzwischen einen Schriftzug; für die drei ältesten wurde er
// aus dem Cover freigestellt, auf dem er ohnehin steht. Fehlte einer, rendert der Hero
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
        logo: 'silent-atlas',
        plot: 'Eine alte Seekarte führt an eine Küste, die auf keiner heutigen Karte steht. Was als Expedition beginnt, wird zur Suche nach den Leuten, die dort einmal gelebt haben — und nach dem Grund, warum niemand ihre Spuren aufschreiben wollte.',
    },
    'ashes-of-tomorrow': {
        logo: 'ashes-of-tomorrow',
        plot: 'Jahre nach dem Ende sammelt eine Überlebende ein, was von den Städten übrig ist: Werkzeuge, Namen, Erinnerungen. Als aus dem Süden ein Funkspruch kommt, muss sie entscheiden, ob die Zukunft ein Ort ist, zu dem man zurückgeht.',
    },
    'neon-harbor': {
        logo: 'neon-harbor',
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
    'cosmo-crew': {
        logo: 'cosmo-crew',
        plot: 'Eine Hundeschnauze, eine Katzenpfote und ein Roboter, der ständig alles doppelt kontrolliert: Die Crew soll nur eine Kiste zum Nachbarmond bringen. Unterwegs geht die Kiste auf — und darin sitzt jemand, der auch nicht weiß, wie er da hineingeraten ist.',
    },
    lanternwood: {
        logo: 'lanternwood',
        plot: 'Im Wald hinter dem Dorf gehen seit Tagen die Lichter an, obwohl niemand sie anzündet. Ein Mädchen folgt ihnen mit einer alten Laterne und einem Fuchs, der genau weiß, wo man nicht hintreten darf.',
    },
    'skygarden-voyage': {
        logo: 'skygarden-voyage',
        plot: 'Eine Erfinderin baut aus einem Bollerwagen und einem Heißluftballon ein Gefährt, das über die Wolken steigt. Oben treibt ein Garten, den seit hundert Jahren niemand gegossen hat — und er wartet ganz offensichtlich auf jemanden.',
    },
    'night-critters': {
        logo: 'night-critters',
        plot: 'Wenn im alten Herrenhaus das Licht ausgeht, fängt für Hase, Hund und Kater die Arbeit an: Sie räumen auf, was der Tag liegen ließ. Bis eine Tür auftaucht, die vorher nicht da war.',
    },
    'robo-und-nico': {
        logo: 'robo-und-nico',
        plot: 'Nico findet in den Ruinen einen Roboter, der nur einen Satz kann: "Ich bringe dich nach Hause." Das Problem ist, dass er nicht sagt, wessen Zuhause er meint.',
    },
    skypals: {
        logo: 'skypals',
        plot: 'Ein Hund mit Fliegerbrille, eine Katze als Navigatorin und ein Flugzeug, das schon bessere Tage gesehen hat. Ihre Post kommt immer an — auch wenn der Weg dahin selten der kürzeste ist.',
    },
    'black-hollow': {
        logo: 'black-hollow',
        plot: 'Ein Dorf am Rand der Moore nimmt Besucher freundlich auf und lässt sie ungern wieder gehen. Eine Frau sucht ihre Schwester, die vor einem Jahr genau hier zuletzt gesehen wurde.',
    },
    'last-light-manor': {
        logo: 'last-light-manor',
        plot: 'Das Herrenhaus steht seit dreißig Jahren leer, aber die Rechnungen für den Strom kommen weiter. Der Erbe fährt hin, um das zu klären, und findet in jedem Zimmer ein Licht, das brennt.',
    },
    'the-weeping-pines': {
        logo: 'the-weeping-pines',
        plot: 'In diesem Waldstück verschwinden keine Menschen — sie kommen zurück, nur eben nicht ganz. Ein Förster geht der Sache mit einer Taschenlampe und deutlich zu viel Zutrauen nach.',
    },
    fogline: {
        logo: 'fogline',
        plot: 'Wenn der Nebel über die Hafenmole zieht, hört man das Nebelhorn eines Schiffes, das seit vierzig Jahren nicht mehr fährt. Eine Journalistin will wissen, wer es bedient.',
    },
    'midnight-clue': {
        logo: 'midnight-clue',
        plot: 'Jede Nacht um Punkt zwölf liegt an derselben Straßenecke ein Hinweis. Eine Ermittlerin sammelt sie seit Wochen — und merkt, dass sie zusammen eine Frage ergeben, die an sie gerichtet ist.',
    },
    'the-hollow-key': {
        logo: 'the-hollow-key',
        plot: 'Der Schlüssel aus dem Nachlass passt in kein Schloss des Hauses. Er passt in das Tor davor, und dahinter liegt ein Grundstück, das im Grundbuch nicht existiert.',
    },
    'aurora-sentinel': {
        logo: 'aurora-sentinel',
        plot: 'Sie kann das Licht der Stadt in den Händen halten, und die Stadt weiß bis heute nicht, wem sie das verdankt. Als die Lichter zum ersten Mal ausgehen, muss sie sich entscheiden, ob sie länger unerkannt bleiben will.',
    },
    'nova-strike': {
        logo: 'nova-strike',
        plot: 'Ein Blitz, der nicht vom Himmel kam, gibt einem Streifenpolizisten mehr Kraft, als eine Stadt verträgt. Seine Vorgesetzten wollen sie einsetzen, seine Nachbarn wollen nur ihre Ruhe.',
    },
    'shadow-vigil': {
        logo: 'shadow-vigil',
        plot: 'Er arbeitet nachts, spricht mit niemandem und hinterlässt an jedem Tatort dasselbe Zeichen. Die Stadt hält ihn für ihren Schutz — bis jemand fragt, wovor er sie eigentlich beschützt.',
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
    'cosmo-crew': [
        ['Cosmo Crew', 2022], ['Cosmo Crew: Frachtraum', 2024],
        ['Cosmo Crew II – Mondhafen', 2025], ['Cosmo Crew: Sternenkarte', 2026],
        ['Cosmo Crew – Landeklappe', 2023], ['Cosmo Crew: Helmfunk', 2021],
        ['Cosmo Crew – Werkzeugkiste', 2020], ['Cosmo Crew: Kometenschweif', 2019],
        ['Cosmo Crew – Bordhund', 2018], ['Cosmo Crew: Schwerelos', 2017],
        ['Cosmo Crew – Andockmanöver', 2016], ['Cosmo Crew: Notproviant', 2026],
        ['Cosmo Crew – Sonnensegel', 2024], ['Cosmo Crew: Rückflugbahn', 2022],
        ['Cosmo Crew – Nachbarmond', 2025], ['Cosmo Crew: Kistenfund', 2023],
    ],
    'lanternwood': [
        ['Lanternwood', 2022], ['Lanternwood: Laternenpfad', 2024],
        ['Lanternwood II – Pilzlichtung', 2025], ['Lanternwood: Fuchsbau', 2026],
        ['Lanternwood – Moosgrund', 2023], ['Lanternwood: Glühwürmchen', 2021],
        ['Lanternwood – Dorfrand', 2020], ['Lanternwood: Nachtfalter', 2019],
        ['Lanternwood – Wurzelwerk', 2018], ['Lanternwood: Waldrand', 2017],
        ['Lanternwood – Brombeerhecke', 2016], ['Lanternwood: Dochtnacht', 2026],
        ['Lanternwood – Lichterkette', 2024], ['Lanternwood: Farnschatten', 2022],
        ['Lanternwood – Wegzeichen', 2025], ['Lanternwood: Tannenzapfen', 2023],
    ],
    'skygarden-voyage': [
        ['Skygarden Voyage', 2022], ['Skygarden Voyage: Ballonfahrt', 2024],
        ['Skygarden Voyage II – Wolkenbeet', 2025], ['Skygarden Voyage: Gießkanne', 2026],
        ['Skygarden Voyage – Hochbeet', 2023], ['Skygarden Voyage: Samenkorn', 2021],
        ['Skygarden Voyage – Windrichtung', 2020], ['Skygarden Voyage: Rankgitter', 2019],
        ['Skygarden Voyage – Bollerwagen', 2018], ['Skygarden Voyage: Blütezeit', 2017],
        ['Skygarden Voyage – Höhenluft', 2016], ['Skygarden Voyage: Regenwolke', 2026],
        ['Skygarden Voyage – Setzling', 2024], ['Skygarden Voyage: Luftwurzeln', 2022],
        ['Skygarden Voyage – Erntedank', 2025], ['Skygarden Voyage: Sonnenblume', 2023],
    ],
    'night-critters': [
        ['Night Critters', 2022], ['Night Critters: Nachtschicht', 2024],
        ['Night Critters II – Kellertreppe', 2025], ['Night Critters: Dachboden', 2026],
        ['Night Critters – Vorratskammer', 2023], ['Night Critters: Laternenlicht', 2021],
        ['Night Critters – Gartenlaube', 2020], ['Night Critters: Kaminecke', 2019],
        ['Night Critters – Wäschekorb', 2018], ['Night Critters: Türspalt', 2017],
        ['Night Critters – Bibliothek', 2016], ['Night Critters: Uhrenkasten', 2026],
        ['Night Critters – Wintergarten', 2024], ['Night Critters: Fensterbank', 2022],
        ['Night Critters – Speisekammer', 2025], ['Night Critters: Nachttisch', 2023],
    ],
    'robo-und-nico': [
        ['Robo und Nico', 2022], ['Robo und Nico: Heimweg', 2024],
        ['Robo und Nico II – Ersatzteile', 2025], ['Robo und Nico: Ladekabel', 2026],
        ['Robo und Nico – Ruinenfeld', 2023], ['Robo und Nico: Kompassnadel', 2021],
        ['Robo und Nico – Werkbank', 2020], ['Robo und Nico: Rostschutz', 2019],
        ['Robo und Nico – Signalturm', 2018], ['Robo und Nico: Batteriewechsel', 2017],
        ['Robo und Nico – Schrottplatz', 2016], ['Robo und Nico: Startknopf', 2026],
        ['Robo und Nico – Regenschauer', 2024], ['Robo und Nico: Zahnrädchen', 2022],
        ['Robo und Nico – Wegbeschreibung', 2025], ['Robo und Nico: Nachtlager', 2023],
    ],
    'skypals': [
        ['SkyPals', 2022], ['SkyPals: Luftpost', 2024],
        ['SkyPals II – Rückenwind', 2025], ['SkyPals: Fliegerbrille', 2026],
        ['SkyPals – Landebahn', 2023], ['SkyPals: Wolkenband', 2021],
        ['SkyPals – Postsack', 2020], ['SkyPals: Seitenruder', 2019],
        ['SkyPals – Abendrot', 2018], ['SkyPals: Propellerhut', 2017],
        ['SkyPals – Flugbuch', 2016], ['SkyPals: Tankstopp', 2026],
        ['SkyPals – Kurskorrektur', 2024], ['SkyPals: Schleifenflug', 2022],
        ['SkyPals – Sturmböe', 2025], ['SkyPals: Zielhafen', 2023],
    ],
    'black-hollow': [
        ['Black Hollow', 2022], ['Black Hollow: Moorrand', 2024],
        ['Black Hollow II – Dorfversammlung', 2025], ['Black Hollow: Gästezimmer', 2026],
        ['Black Hollow – Ortsschild', 2023], ['Black Hollow: Nebelbank', 2021],
        ['Black Hollow – Bruchwald', 2020], ['Black Hollow: Kirchhof', 2019],
        ['Black Hollow – Torfstich', 2018], ['Black Hollow: Landstraße', 2017],
        ['Black Hollow – Wirtshaus', 2016], ['Black Hollow: Suchtrupp', 2026],
        ['Black Hollow – Talkessel', 2024], ['Black Hollow: Grenzstein', 2022],
        ['Black Hollow – Schwesterfrage', 2025], ['Black Hollow: Heimfahrt', 2023],
    ],
    'last-light-manor': [
        ['Last Light Manor', 2022], ['Last Light Manor: Stromrechnung', 2024],
        ['Last Light Manor II – Ostflügel', 2025], ['Last Light Manor: Sicherungskasten', 2026],
        ['Last Light Manor – Erbschaft', 2023], ['Last Light Manor: Fensterläden', 2021],
        ['Last Light Manor – Dienstbotentrakt', 2020], ['Last Light Manor: Kaminzimmer', 2019],
        ['Last Light Manor – Parkanlage', 2018], ['Last Light Manor: Schlüsselbund', 2017],
        ['Last Light Manor – Bibliothekstrakt', 2016], ['Last Light Manor: Nachtwache', 2026],
        ['Last Light Manor – Treppenhaus', 2024], ['Last Light Manor: Wintergarten', 2022],
        ['Last Light Manor – Torhaus', 2025], ['Last Light Manor: Lichtschalter', 2023],
    ],
    'the-weeping-pines': [
        ['The Weeping Pines', 2022], ['The Weeping Pines: Forstweg', 2024],
        ['The Weeping Pines II – Schonung', 2025], ['The Weeping Pines: Wildkanzel', 2026],
        ['The Weeping Pines – Rückkehrer', 2023], ['The Weeping Pines: Harzgeruch', 2021],
        ['The Weeping Pines – Schneise', 2020], ['The Weeping Pines: Nadelboden', 2019],
        ['The Weeping Pines – Reviergrenze', 2018], ['The Weeping Pines: Windbruch', 2017],
        ['The Weeping Pines – Suchhund', 2016], ['The Weeping Pines: Taschenlampe', 2026],
        ['The Weeping Pines – Baumreihe', 2024], ['The Weeping Pines: Nebelloch', 2022],
        ['The Weeping Pines – Försterei', 2025], ['The Weeping Pines: Rufweite', 2023],
    ],
    'fogline': [
        ['Fogline', 2022], ['Fogline: Hafenmole', 2024],
        ['Fogline II – Nebelhorn', 2025], ['Fogline: Leuchtturmwärter', 2026],
        ['Fogline – Anlegestelle', 2023], ['Fogline: Schiffsregister', 2021],
        ['Fogline – Uferstraße', 2020], ['Fogline: Wasserlinie', 2019],
        ['Fogline – Hafenamt', 2018], ['Fogline: Bojenfeld', 2017],
        ['Fogline – Fährhaus', 2016], ['Fogline: Tidenkalender', 2026],
        ['Fogline – Wrackteil', 2024], ['Fogline: Signalfeuer', 2022],
        ['Fogline – Redaktionsschluss', 2025], ['Fogline: Kaimauer', 2023],
    ],
    'midnight-clue': [
        ['Midnight Clue', 2022], ['Midnight Clue: Straßenecke', 2024],
        ['Midnight Clue II – Zettelkasten', 2025], ['Midnight Clue: Nachtbriefkasten', 2026],
        ['Midnight Clue – Fundsache', 2023], ['Midnight Clue: Uhrschlag', 2021],
        ['Midnight Clue – Laternenpfahl', 2020], ['Midnight Clue: Notizbuch', 2019],
        ['Midnight Clue – Bushaltestelle', 2018], ['Midnight Clue: Wandzeitung', 2017],
        ['Midnight Clue – Passantenbefragung', 2016], ['Midnight Clue: Rückwärtsgang', 2026],
        ['Midnight Clue – Frageform', 2024], ['Midnight Clue: Handschrift', 2022],
        ['Midnight Clue – Absenderlos', 2025], ['Midnight Clue: Nachtstunde', 2023],
    ],
    'the-hollow-key': [
        ['The Hollow Key', 2022], ['The Hollow Key: Nachlass', 2024],
        ['The Hollow Key II – Grundbuch', 2025], ['The Hollow Key: Torflügel', 2026],
        ['The Hollow Key – Schlossblech', 2023], ['The Hollow Key: Katasteramt', 2021],
        ['The Hollow Key – Hausgang', 2020], ['The Hollow Key: Mauerring', 2019],
        ['The Hollow Key – Erbstück', 2018], ['The Hollow Key: Vorgarten', 2017],
        ['The Hollow Key – Bartform', 2016], ['The Hollow Key: Zwischentür', 2026],
        ['The Hollow Key – Flurende', 2024], ['The Hollow Key: Zaunlücke', 2022],
        ['The Hollow Key – Nachtbesuch', 2025], ['The Hollow Key: Schlüsselloch', 2023],
    ],
    'aurora-sentinel': [
        ['Aurora Sentinel', 2022], ['Aurora Sentinel: Lichtträgerin', 2024],
        ['Aurora Sentinel II – Stadtwacht', 2025], ['Aurora Sentinel: Morgenschein', 2026],
        ['Aurora Sentinel – Namenlos', 2023], ['Aurora Sentinel: Flügelschlag', 2021],
        ['Aurora Sentinel – Hochhausdach', 2020], ['Aurora Sentinel: Lichtbogen', 2019],
        ['Aurora Sentinel – Stromausfall', 2018], ['Aurora Sentinel: Doppelleben', 2017],
        ['Aurora Sentinel – Rettungseinsatz', 2016], ['Aurora Sentinel: Sonnenkreis', 2026],
        ['Aurora Sentinel – Blendwirkung', 2024], ['Aurora Sentinel: Wächteramt', 2022],
        ['Aurora Sentinel – Enttarnung', 2025], ['Aurora Sentinel: Abendhimmel', 2023],
    ],
    'nova-strike': [
        ['Nova Strike', 2022], ['Nova Strike: Blitzschlag', 2024],
        ['Nova Strike II – Dienstmarke', 2025], ['Nova Strike: Überlast', 2026],
        ['Nova Strike – Streifenwagen', 2023], ['Nova Strike: Nachbarschaft', 2021],
        ['Nova Strike – Vorgesetzte', 2020], ['Nova Strike: Energiestoß', 2019],
        ['Nova Strike – Schichtdienst', 2018], ['Nova Strike: Rückstoß', 2017],
        ['Nova Strike – Kraftprobe', 2016], ['Nova Strike: Funkstille', 2026],
        ['Nova Strike – Zielfahndung', 2024], ['Nova Strike: Hochspannung', 2022],
        ['Nova Strike – Diensteid', 2025], ['Nova Strike: Nachtschicht', 2023],
    ],
    'shadow-vigil': [
        ['Shadow Vigil', 2022], ['Shadow Vigil: Nachtzeichen', 2024],
        ['Shadow Vigil II – Tatortmarke', 2025], ['Shadow Vigil: Umhangsaum', 2026],
        ['Shadow Vigil – Stadtwache', 2023], ['Shadow Vigil: Regennacht', 2021],
        ['Shadow Vigil – Hochhausschlucht', 2020], ['Shadow Vigil: Schutzbehauptung', 2019],
        ['Shadow Vigil – Zeichenkunde', 2018], ['Shadow Vigil: Dachkante', 2017],
        ['Shadow Vigil – Unbekannt', 2016], ['Shadow Vigil: Wachablösung', 2026],
        ['Shadow Vigil – Gegenfrage', 2024], ['Shadow Vigil: Sturmnacht', 2022],
        ['Shadow Vigil – Schuldfrage', 2025], ['Shadow Vigil: Morgengrauen', 2023],
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
    'cosmo-crew': ['Cosmo Crew', 'Cosmo Crew: Bordbuch', 'Cosmo Crew – Frachtfahrten', 'Cosmo Crew: Mondhafen', 'Cosmo Crew – Helmfunk', 'Cosmo Crew: Sternenkarten', 'Cosmo Crew: Werkzeugkiste'],
    'lanternwood': ['Lanternwood', 'Lanternwood: Laternenpfade', 'Lanternwood – Waldgeschichten', 'Lanternwood: Fuchsbauten', 'Lanternwood – Nachtfalter', 'Lanternwood: Moosgründe', 'Lanternwood: Wegzeichen'],
    'skygarden-voyage': ['Skygarden Voyage', 'Skygarden Voyage: Ballonfahrten', 'Skygarden Voyage – Wolkenbeete', 'Skygarden Voyage: Setzlinge', 'Skygarden Voyage – Höhenluft', 'Skygarden Voyage: Blütezeiten', 'Skygarden Voyage: Windrichtungen'],
    'night-critters': ['Night Critters', 'Night Critters: Nachtschichten', 'Night Critters – Kellertreppen', 'Night Critters: Dachböden', 'Night Critters – Türspalten', 'Night Critters: Vorratskammern', 'Night Critters: Uhrenkästen'],
    'robo-und-nico': ['Robo und Nico', 'Robo und Nico: Heimwege', 'Robo und Nico – Ersatzteile', 'Robo und Nico: Ruinenfelder', 'Robo und Nico – Werkbänke', 'Robo und Nico: Signaltürme', 'Robo und Nico: Nachtlager'],
    'skypals': ['SkyPals', 'SkyPals: Luftpost', 'SkyPals – Landebahnen', 'SkyPals: Flugbücher', 'SkyPals – Kurskorrekturen', 'SkyPals: Zielhäfen', 'SkyPals: Tankstopps'],
    'black-hollow': ['Black Hollow', 'Black Hollow: Moorränder', 'Black Hollow – Dorfversammlungen', 'Black Hollow: Gästezimmer', 'Black Hollow – Suchtrupps', 'Black Hollow: Nebelbänke', 'Black Hollow: Grenzsteine'],
    'last-light-manor': ['Last Light Manor', 'Last Light Manor: Ostflügel', 'Last Light Manor – Treppenhäuser', 'Last Light Manor: Fensterläden', 'Last Light Manor – Nachtwachen', 'Last Light Manor: Schlüsselbunde', 'Last Light Manor: Torhäuser'],
    'the-weeping-pines': ['The Weeping Pines', 'The Weeping Pines: Forstwege', 'The Weeping Pines – Reviergrenzen', 'The Weeping Pines: Schneisen', 'The Weeping Pines – Rückkehrer', 'The Weeping Pines: Nebellöcher', 'The Weeping Pines: Försterei'],
    'fogline': ['Fogline', 'Fogline: Hafenmolen', 'Fogline – Nebelhörner', 'Fogline: Schiffsregister', 'Fogline – Uferstraßen', 'Fogline: Signalfeuer', 'Fogline: Kaimauern'],
    'midnight-clue': ['Midnight Clue', 'Midnight Clue: Straßenecken', 'Midnight Clue – Zettelkästen', 'Midnight Clue: Notizbücher', 'Midnight Clue – Fundsachen', 'Midnight Clue: Handschriften', 'Midnight Clue: Nachtstunden'],
    'the-hollow-key': ['The Hollow Key', 'The Hollow Key: Nachlässe', 'The Hollow Key – Grundbücher', 'The Hollow Key: Torflügel', 'The Hollow Key – Mauerringe', 'The Hollow Key: Zwischentüren', 'The Hollow Key: Zaunlücken'],
    'aurora-sentinel': ['Aurora Sentinel', 'Aurora Sentinel: Stadtwacht', 'Aurora Sentinel – Lichtbögen', 'Aurora Sentinel: Doppelleben', 'Aurora Sentinel – Rettungseinsätze', 'Aurora Sentinel: Wächterämter', 'Aurora Sentinel: Abendhimmel'],
    'nova-strike': ['Nova Strike', 'Nova Strike: Schichtdienste', 'Nova Strike – Energiestöße', 'Nova Strike: Diensteide', 'Nova Strike – Zielfahndungen', 'Nova Strike: Kraftproben', 'Nova Strike: Funkstille'],
    'shadow-vigil': ['Shadow Vigil', 'Shadow Vigil: Nachtzeichen', 'Shadow Vigil – Stadtwachen', 'Shadow Vigil: Dachkanten', 'Shadow Vigil – Schuldfragen', 'Shadow Vigil: Regennächte', 'Shadow Vigil: Wachablösungen'],
};

// ---------------------------------------------------------------------------
// Die Werte der Infozeile im Detail: Genres, Altersfreigabe, Bewertung,
// Laufzeit, Besetzung, Regie.
//
// Ein Xtream-Anbieter liefert sie über get_vod_info. Eine reine M3U-Liste hatte
// dafür keinen Weg, und weil diese Playlist bewusst gar keinen Metadaten-
// Anbieter mehr befragt (siehe check-title-collisions.mjs), blieb die Zeile
// unter jedem Film leer. Seit der App-Änderung vom 03.09.2026 liest der Parser
// tvg-genre / tvg-age / tvg-rating / tvg-runtime / tvg-cast / tvg-director.
//
// Je Marke steht hier, was zum Cover passt — Altersfreigabe und Genre kommen
// vom Genre, nicht vom Zufall: "Zum Gruseln" mit FSK 0 wäre sofort als Attrappe
// erkennbar. Bewertung und Laufzeit variieren dagegen pro TITEL, damit die
// Reihen nicht wie eine Tapete aus identischen Zahlen aussehen; sie werden im
// Generator deterministisch aus dem Titel abgeleitet, also bei jedem Bau gleich.
// ---------------------------------------------------------------------------
export const BRAND_FACTS = {
    northbound:          { genres: ['Abenteuer', 'Thriller'],        age: '12', minuten: [96, 128], wertung: [6.4, 7.9] },
    'midnight-circuit':  { genres: ['Science Fiction', 'Thriller'],  age: '16', minuten: [104, 141], wertung: [6.8, 8.4] },
    'silent-atlas':      { genres: ['Abenteuer', 'Dokumentation'],   age: '6',  minuten: [88, 119], wertung: [6.9, 8.2] },
    'ashes-of-tomorrow': { genres: ['Science Fiction', 'Drama'],     age: '16', minuten: [101, 137], wertung: [6.2, 7.8] },
    'neon-harbor':       { genres: ['Krimi', 'Thriller'],            age: '16', minuten: [94, 126], wertung: [6.5, 8.0] },
    'after-the-fall':    { genres: ['Science Fiction', 'Drama'],     age: '12', minuten: [98, 133], wertung: [6.6, 8.1] },
    'beyond-horizons':   { genres: ['Abenteuer', 'Drama'],           age: '6',  minuten: [92, 121], wertung: [6.7, 8.3] },
    'crimson-files':     { genres: ['Krimi', 'Mystery'],             age: '16', minuten: [99, 134], wertung: [6.5, 8.2] },
    'eclipse-protocol':  { genres: ['Science Fiction', 'Mystery'],   age: '12', minuten: [106, 144], wertung: [6.3, 8.0] },
    'iron-dawn':         { genres: ['Kriegsfilm', 'Drama'],          age: '16', minuten: [108, 152], wertung: [6.6, 8.4] },
    'neon-district':     { genres: ['Science Fiction', 'Krimi'],     age: '16', minuten: [97, 129], wertung: [6.4, 7.9] },
    'northland-saga':    { genres: ['Historienfilm', 'Abenteuer'],   age: '16', minuten: [112, 158], wertung: [6.8, 8.5] },
    'only-forever':      { genres: ['Liebesfilm', 'Drama'],          age: '6',  minuten: [89, 118], wertung: [6.1, 7.7] },
    'realms-awakened':   { genres: ['Fantasy', 'Abenteuer'],         age: '12', minuten: [115, 161], wertung: [6.9, 8.6] },
    'shattered-lies':    { genres: ['Thriller', 'Drama'],            age: '16', minuten: [95, 127], wertung: [6.3, 8.1] },
    'cosmo-crew':        { genres: ['Animation', 'Familie'],          age: '0',  minuten: [78, 96],   wertung: [6.8, 8.2] },
    lanternwood:         { genres: ['Animation', 'Fantasy'],          age: '6',  minuten: [82, 101],  wertung: [7.0, 8.4] },
    'skygarden-voyage':  { genres: ['Animation', 'Abenteuer'],        age: '0',  minuten: [80, 98],   wertung: [6.9, 8.3] },
    'night-critters':    { genres: ['Animation', 'Familie'],          age: '0',  minuten: [76, 94],   wertung: [6.7, 8.1] },
    'robo-und-nico':     { genres: ['Animation', 'Science Fiction'],  age: '6',  minuten: [84, 103],  wertung: [7.1, 8.5] },
    skypals:             { genres: ['Animation', 'Abenteuer'],        age: '0',  minuten: [74, 92],   wertung: [6.6, 8.0] },
    'black-hollow':      { genres: ['Horror', 'Mystery'],             age: '16', minuten: [93, 122],  wertung: [6.0, 7.6] },
    'last-light-manor':  { genres: ['Horror', 'Thriller'],            age: '16', minuten: [96, 126],  wertung: [6.2, 7.8] },
    'the-weeping-pines': { genres: ['Horror', 'Mystery'],             age: '18', minuten: [90, 118],  wertung: [5.9, 7.5] },
    fogline:             { genres: ['Mystery', 'Thriller'],           age: '12', minuten: [98, 130],  wertung: [6.5, 8.1] },
    'midnight-clue':     { genres: ['Mystery', 'Krimi'],              age: '12', minuten: [95, 127],  wertung: [6.7, 8.3] },
    'the-hollow-key':    { genres: ['Mystery', 'Drama'],              age: '12', minuten: [100, 133], wertung: [6.6, 8.2] },
    'aurora-sentinel':   { genres: ['Action', 'Fantasy'],             age: '12', minuten: [110, 148], wertung: [6.4, 8.0] },
    'nova-strike':       { genres: ['Action', 'Science Fiction'],     age: '12', minuten: [106, 143], wertung: [6.3, 7.9] },
    'shadow-vigil':      { genres: ['Action', 'Krimi'],               age: '16', minuten: [108, 146], wertung: [6.5, 8.2] },
};

// Erfundene Namen für Besetzung und Regie.
//
// Bewusst KEINE echten Schauspieler: die App schlägt sonst nicht gefundene
// Namen bei TMDB nach und hängt einem erfundenen Film ein echtes Porträt an.
// Für diese Liste ist der Weg zusätzlich abgeschaltet (die App fragt für einen
// Eintrag mit eigenem Artwork gar keinen Anbieter mehr), aber die Namen sollen
// auch dann harmlos sein, wenn jemand die Liste in einem anderen Player öffnet.
export const CAST_POOL = [
    'Marek Halvorsen', 'Ines Brandtner', 'Tomas Ekvall', 'Rieke Sandmann',
    'Jonan Petrescu', 'Liv Aarhusen', 'Cassian Merle', 'Nora Vestergaard',
    'Emil Ravnborg', 'Sanna Lindqvist', 'Arno Delacroix', 'Mira Toivonen',
    'Bastian Kohl', 'Selma Rutkowski', 'Ivar Bengtsson', 'Juno Marchetti',
    'Aleks Norrback', 'Thea Lindgren', 'Roman Kesselring', 'Vera Ahlgren',
    'Nikolas Ferrand', 'Hedda Wulfson', 'Milan Voskuil', 'Freya Ostberg',
];

export const DIRECTOR_POOL = [
    'Anouk Verhagen', 'Stellan Broch', 'Mira Kaltenbach', 'Yannick Roussel',
    'Ida Sonnleitner', 'Halvard Nyström', 'Céline Marchand', 'Piet Vandersteen',
    'Rasmus Ehlert', 'Nadja Wolanski', 'Emile Bouchard', 'Katrin Sjöberg',
];
