import { useState, useEffect, useCallback, useRef } from 'react';

export interface SonosZone {
  id: string;
  name: string;
  state: 'playing' | 'paused' | 'stopped';
  volume: number;
  members: string[];
}

export function useSonos() {
  const [zones, setZones] = useState<SonosZone[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Proxied through the same server (nginx /sonos/ -> node-sonos-http-api)
  const apiBase = '/sonos';

  const discover = useCallback(async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch(`${apiBase}/zones`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Sonos API not reachable');
      const data = await res.json();

      const parsed: SonosZone[] = data.map((zone: any) => ({
        id: zone.uuid,
        name: zone.coordinator?.roomName || zone.members?.[0]?.roomName || 'Sonos',
        state: zone.coordinator?.state?.playbackState?.toLowerCase() || 'stopped',
        volume: zone.coordinator?.state?.volume ?? 50,
        members: zone.members?.map((m: any) => m.roomName) || [],
      }));

      setZones(parsed);
      setAvailable(true);
    } catch {
      setZones([]);
      setAvailable(false);
    } finally {
      setIsDiscovering(false);
    }
  }, [apiBase]);

  // Try to discover on mount
  useEffect(() => {
    discover();
  }, [discover]);

  // Poll zones while a zone is active
  useEffect(() => {
    if (!activeZone) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(discover, 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeZone, discover]);

  const playOnSonos = useCallback(
    async (zoneName: string, streamUrl: string) => {
      try {
        const encoded = encodeURIComponent(streamUrl);
        await fetch(`${apiBase}/${encodeURIComponent(zoneName)}/setavtransporturi/${encoded}`);
        await fetch(`${apiBase}/${encodeURIComponent(zoneName)}/play`);
        setActiveZone(zoneName);
      } catch {
        // Failed to play on Sonos
      }
    },
    [apiBase],
  );

  const pauseOnSonos = useCallback(
    async (zoneName: string) => {
      try {
        await fetch(`${apiBase}/${encodeURIComponent(zoneName)}/pause`);
        setActiveZone(null);
      } catch {
        // Failed to pause
      }
    },
    [apiBase],
  );

  const setVolumeOnSonos = useCallback(
    async (zoneName: string, vol: number) => {
      try {
        await fetch(`${apiBase}/${encodeURIComponent(zoneName)}/volume/${Math.round(vol)}`);
      } catch {
        // Failed to set volume
      }
    },
    [apiBase],
  );

  return {
    zones,
    isDiscovering,
    available,
    activeZone,
    discover,
    playOnSonos,
    pauseOnSonos,
    setVolumeOnSonos,
  };
}
