# AzuraCast Setup

## Voraussetzungen

- Docker & Docker Compose installiert
- Ports 8080, 8000-8050 frei

## Installation

```bash
cd backend
cp azuracast.env.example azuracast.env
# azuracast.env öffnen und MYSQL_ROOT_PASSWORD setzen
docker compose up -d
```

## Erster Start

1. Öffne http://localhost:8080
2. Setup-Wizard durchlaufen:
   - Admin-Account erstellen
   - Station anlegen:
     - **Name**: Kutsho Radio
     - **Shortcode**: `kutsho_radio`
     - **Frontend**: Icecast
     - **Backend**: Liquidsoap
3. Station starten

## Playlist hochladen

1. Station → Media → Dateien hochladen (MP3/FLAC)
2. Neue Playlist erstellen → Dateien zuweisen
3. Station → Profile → "Standard-Playlist" zuweisen

## API testen

```bash
curl http://localhost:8080/api/nowplaying/kutsho_radio
```

## Befehle

```bash
docker compose up -d      # Starten
docker compose down        # Stoppen
docker compose logs -f     # Logs
docker compose pull        # Update
```
