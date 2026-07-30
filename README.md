# OkayIPTV — Demo-Playlist

Eine vollständig legale Test-Playlist für die App **OkayIPTV**. Sie enthält
keinerlei Inhalte eines Pay-Anbieters — nur frei lizenzierte Videos und
offizielle, frei empfangbare Live-Streams.

## M3U-Link für Tester

```
https://erimoezac.github.io/okaytv-demo-playlist/playlist.m3u
```

In der App unter *Anmelden → M3U-Link* einfügen. Kein Benutzername, kein
Passwort.

## Was drin ist

| Bereich | Umfang |
| --- | --- |
| Live-TV | 92 Sender in 24 Kategorien (ARD/ZDF komplett, Regionalsender, Nachrichten, Musik, Shopping, International) |
| Filme | 85 Titel, 443 Kacheln in 21 Kategorien (19 Genres + Test-Formate + Open Movies) |
| Serien | 34 Serien mit 1–3 Staffeln und 513 Folgen in 8 Kategorien |
| EPG | XMLTV-Quellen für DE, AT, CH, UK, US, FR, IT, ES, GR, JP, KR, SA |

1056 Einträge insgesamt. Jede Filmzeile zeigt alle fünf Cover im Wechsel, jede
Serienzeile ebenso — innerhalb einer Kategorie bekommt jeder Eintrag eine
eigene Cover-URL, weil der Parser sonst alles wegwirft, was sich ein Poster
teilt.

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

**Cover:** eigene Artworks. Titel und Serien sind frei erfunden; die fünf
Marken (*Northbound*, *Midnight Circuit*, *The Silent Atlas*, *Ashes of
Tomorrow*, *Neon Harbor*) existieren nur in dieser Demo.

## Neu bauen

```bash
node tools/curate-live.mjs     # holt + prüft die Live-Sender → live-channels.json
node tools/build-playlist.mjs  # baut playlist.m3u
```

`--base=https://host/pfad` setzt die Basis-URL für die Cover, falls die
Playlist woanders liegt.
