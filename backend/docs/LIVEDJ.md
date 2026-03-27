# Live-DJ Einwahl

Konfiguration für MIXXX oder BUTT um live auf Kutsho Radio zu streamen.

## AzuraCast Konfiguration

1. Station → Streamer/DJs → "Streamer aktivieren" einschalten
2. Neuen Streamer anlegen:
   - **Username**: dein-dj-name
   - **Password**: sicheres Passwort setzen

## Verbindungsdaten

| Einstellung | Wert |
|---|---|
| **Server/Host** | `localhost` (oder `radio.kutsho.com`) |
| **Port** | `8000` |
| **Mount** | `/live` |
| **Username** | dein-dj-name |
| **Password** | dein-passwort |
| **Typ** | Icecast |

## MIXXX

1. Einstellungen → Live-Übertragung
2. Typ: **Icecast 2**
3. Host, Port, Mount, Login eintragen (siehe oben)
4. Encoding: MP3 oder OGG, Bitrate: 192 kbps empfohlen
5. "Übertragung aktivieren" klicken

## BUTT (Broadcast Using This Tool)

1. Settings → Main → Server → Add
2. Typ: **Icecast**, Adresse und Port eintragen
3. Mountpoint: `/live`
4. User + Password eintragen
5. Settings → Audio → Format: MP3, Bitrate: 192 kbps
6. "Play" drücken zum Starten

## Testen

Nach Verbindung sollte in der AzuraCast API `live.is_live: true` erscheinen:

```bash
curl http://localhost:8080/api/nowplaying/kutsho_radio | jq '.live'
```
