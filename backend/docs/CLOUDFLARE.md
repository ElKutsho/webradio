# Cloudflare Tunnel Setup

Routet `radio.kutsho.com` über einen Cloudflare Tunnel zu AzuraCast.

## Voraussetzungen

- Cloudflare-Account mit kutsho.com Domain
- `cloudflared` installiert: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

## Tunnel erstellen

```bash
cloudflared tunnel login
cloudflared tunnel create webradio
```

## Konfiguration

Erstelle `~/.cloudflared/config.yml`:

```yaml
tunnel: webradio
credentials-file: ~/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: radio.kutsho.com
    service: http://localhost:8080
  - service: http_status:404
```

## DNS einrichten

```bash
cloudflared tunnel route dns webradio radio.kutsho.com
```

## Tunnel starten

```bash
cloudflared tunnel run webradio
```

Für den Dauerbetrieb als Systemd-Service:

```bash
cloudflared service install
```

## Icecast Streaming Ports

Die Streaming-Ports (8000+) können **nicht** über Cloudflare Tunnel geroutet werden (kein HTTP). Optionen:

1. **Empfohlen**: In AzuraCast unter Station → Profile den "Custom External URL" auf die direkte Server-IP setzen
2. Alternativ: Ports 8000-8050 direkt am Server öffnen (Firewall)
