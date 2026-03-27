import { useState, useEffect, useRef } from 'react';
import type { NowPlayingData } from '../types/nowplaying';
import { fetchNowPlaying } from '../services/api';
import { connectSSE } from '../services/sse';
import { subscribeMock } from '../services/mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATION = import.meta.env.VITE_STATION_SHORTCODE;
const POLL_INTERVAL = 15_000;

export function useNowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (USE_MOCK) {
      const unsubscribe = subscribeMock((np) => {
        setData(np);
        setIsLoading(false);
      });
      cleanupRef.current = unsubscribe;
      return unsubscribe;
    }

    // Real mode: try SSE first, fall back to polling
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    // Initial fetch
    fetchNowPlaying()
      .then((np) => {
        if (!cancelled) {
          setData(np);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    // Try SSE connection
    try {
      const closeSSE = connectSSE(BASE_URL, STATION, (np) => {
        if (!cancelled) {
          setData(np);
          setIsLoading(false);
          setError(null);
        }
      });
      cleanupRef.current = closeSSE;
    } catch {
      // SSE failed, fall back to polling
      pollTimer = setInterval(async () => {
        try {
          const np = await fetchNowPlaying();
          if (!cancelled) {
            setData(np);
            setError(null);
          }
        } catch (err) {
          if (!cancelled) setError(err as Error);
        }
      }, POLL_INTERVAL);
    }

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  return { data, isLoading, error };
}
