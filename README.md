# OkayIPTV — Demo-Playlist

Eine vollständig legale Test-Playlist für die App **OkayIPTV**. Sie enthält
keinerlei Inhalte eines Pay-Anbieters — nur frei lizenzierte Videos und
offizielle, frei empfangbare Live-Streams.

## M3U-Link für Tester

```
https://erimoezac.github.io/okaytv-demo-playlist/okaytv-demo.m3u
```

In der App unter *Anmelden → M3U-Link* einfügen. Kein Benutzername, kein
Passwort.

`playlist.m3u` liegt daneben und ist byte-identisch. Zwei Namen, weil die App
jede Playlist-Antwort über 100 Zeichen unter ihrer URL in der CacheStorage
ablegt und beim nächsten Login von dort liest: wer die Liste erwischt, während
GitHub Pages gerade deployt, bekommt deren 404-Seite in diesen Slot und danach
bei jedem Versuch „Ungültiger Playlist-Inhalt". Der zweite Name ist dann eine
URL, die noch kein Cache gesehen hat.

## Was drin ist

| Bereich | Umfang |
| --- | --- |
| Live-TV | 92 Sender in 22 Kategorien (ARD/ZDF komplett, Regionalsender, Nachrichten, Musik, Shopping, International) |
| Filme | 251 Titel, 443 Kacheln in 21 Kategorien (19 Genres + Test-Formate + Open Movies) |
| Serien | 47 Serien mit 1–3 Staffeln und 521 Folgen in 8 Kategorien |
| EPG | XMLTV-Quellen für DE, AT, CH, UK, US, FR, IT, ES, GR, JP, KR, SA |

1056 Einträge insgesamt, verteilt auf **15 Marken** mit je eigenem Cover,
Titelbild und Kurzbeschreibung. Jede Filmzeile läuft durch alle fünfzehn, jede
Serienzeile ebenso — innerhalb einer Kategorie bekommt jeder Eintrag eine
eigene Cover-URL, weil der Parser sonst alles wegwirft, was sich ein Poster
teilt.

## Artwork in der Liste

Jeder VOD-Eintrag bringt sein Aussehen selbst mit, über vier Attribute:

| Attribut | Inhalt |
| --- | --- |
| `tvg-logo` | hochkantes Cover, 600×900 → `covers/<marke>-NN.jpg` |
| `tvg-backdrop` | breites Titelbild für die Bühne, 1672×941 → `hero/<marke>.jpg` |
| `tvg-titlelogo` | freigestellter Schriftzug → `logos/<marke>.png` |
| `tvg-plot` | Kurzbeschreibung der Marke |

Die letzten drei sind kein Standard, aber die Schreibweise, die verbreitete
Listen für Zusatz-Artwork benutzen; Player, die sie nicht kennen, ignorieren sie
folgenlos. OkayIPTV liest alle vier — und schlägt für einen Eintrag, der Cover,
Titelbild und Beschreibung mitbringt, **keinen Metadaten-Anbieter mehr nach**.
Das ist wichtiger, als es klingt: siehe `tools/check-title-collisions.mjs`.

Ein Titel-Logo gibt es für zwölf der fünfzehn Marken. Für die übrigen drei setzt
die Bühne den Titel als Text — auch dieser Weg soll abgedeckt sein.

Absichtlich abgedeckte Sonderfälle: Serien in zwei Kategorien (werden zu einer
Kachel zusammengeführt), deutsche Staffel-/Folgen-Schreibweise, komplette
Staffeln als einzelner Eintrag, Sprach-Präfixe für den Sprachfilter, und eine
Kategorie mit MKV-, WebM- und HEVC-Streams für die Player-Pfade.

Die Kategorien sind mit Sprach-Präfixen (`DE |`, `EN |`, `TR |`, …) benannt,
damit der Sprachfilter und die EPG-Länderzuordnung der App etwas zu tun haben.

## Herkunft der Inhalte

**Videos (Filme & Serienfolgen):** die Blender Open Movies — *Big Buck Bunny*,
*Sintel*, *Elephants Dream*, *Tears of Steel*, *Cosmos Laundromat*. Alle unter
Creative Commons Attribution (CC-BY) veröffentlicht, © Blender Foundation,
[blender.org](https://www.blender.org). Sie liegen als 480p-Fassungen unter
`vod/` in diesem Repository; die Originaldateien hängen als Release
[`assets-v1`](../../releases/tag/assets-v1) daran.

Die Dateinamen sind absichtlich reine Zahlen. OkayIPTV nimmt das letzte
Pfadsegment einer Stream-URL als zusätzlichen TMDB-Suchbegriff — bei einem
sprechenden Namen wie `tears_of_steel_720p.mp4` findet die App den echten Film
und ersetzt damit Cover, Beschreibung und Hintergrundbild der Demo. Bei einem
rein numerischen Segment lässt sie es bleiben, und die Demo-Cover bleiben stehen.

**Live-Sender:** ausgewählt aus [Free-TV/IPTV](https://github.com/Free-TV/IPTV)
und danach doppelt gefiltert — es bleiben nur Streams übrig, die vom CDN des
Senders selbst oder von einer lizenzierten FAST-Plattform (Wurl, Xumo, Amagi,
Rakuten, Plex, Google DAI) ausgeliefert werden. Jeder Sender wurde vor der
Aufnahme auf Erreichbarkeit geprüft.

**Cover, Titelbilder und Schriftzüge:** eigene Artworks. Titel und Serien sind
frei erfunden; die fünfzehn Marken (*Northbound*, *Midnight Circuit*, *The
Silent Atlas*, *Ashes of Tomorrow*, *Neon Harbor*, *After the Fall*, *Beyond
Horizons*, *Crimson Files*, *Eclipse Protocol*, *Iron Dawn*, *Neon District*,
*Northland Saga*, *Only Forever*, *Realms Awakened*, *Shattered Lies*)
existieren nur in dieser Demo.

## Warum die Titel keine echten Filme treffen dürfen

OkayIPTV zerlegt einen Titel an `:` und `–` und fragt jeden Teil einzeln bei
TMDB nach. Aus *„Northbound – Weißes Rauschen"* wurde so die Anfrage *„Weißes
Rauschen"* — und die traf den Netflix-Film *White Noise*. Dessen Poster und
dessen Inhaltsangabe hingen danach an einem Eintrag, hinter dem *Big Buck Bunny*
läuft. Ausgerechnet die Liste, die es nur gibt, weil sie rechtefrei ist, zeigte
fremdes Material.

```bash
node tools/check-title-collisions.mjs
```

fragt jeden Titelbestandteil beim TMDB-Proxy nach und listet die Treffer. Beim
ersten Lauf waren es 111 von 345 — über die Titelwahl ist das nicht zu lösen,
weil TMDB zu fast jedem Wort irgendeine Doku oder einen Kurzfilm führt. Gelöst
ist es deshalb in der App: für einen Eintrag mit eigenem Artwork wird gar nichts
mehr nachgeschlagen. Das Skript bleibt als Bericht — es beantwortet, was ein
fremder Player anziehen würde, der eigene Metadaten sucht.

## Neu bauen

```bash
node tools/curate-live.mjs     # holt + prüft die Live-Sender → live-channels.json
node tools/build-playlist.mjs  # baut playlist.m3u
```

Marken, Titel und Beschreibungen stehen in `tools/titles.mjs` — getrennt vom
Generator, damit die Kollisionsprüfung sie lesen kann, ohne die Playlist neu zu
schreiben.

`--base=https://host/pfad` setzt die Basis-URL für die Bilder, falls die
Playlist woanders liegt.
