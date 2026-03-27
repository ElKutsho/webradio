# Kutsho Webradio

Webradio für kutsho.com — AzuraCast Backend + React Frontend.

## Struktur

- `backend/` — AzuraCast Docker-Setup + Dokumentation
- `frontend/` — Vite + React + TypeScript + Tailwind CSS

## Quickstart

### Backend (AzuraCast)

```bash
cd backend
cp azuracast.env.example azuracast.env  # Passwörter anpassen
docker compose up -d
```

Dann Setup-Wizard öffnen: http://localhost:8080

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Öffne http://localhost:5173 — läuft standardmäßig im Mock-Modus ohne AzuraCast.

## Umgebungsvariablen (Frontend)

| Variable | Beschreibung | Default |
|---|---|---|
| `VITE_API_BASE_URL` | AzuraCast API URL | `http://localhost:8080` |
| `VITE_STATION_SHORTCODE` | Station Shortcode | `kutsho_radio` |
| `VITE_USE_MOCK` | Mock-Daten verwenden | `true` |
