import { useState, useEffect, useRef } from 'react';
import type { NowPlayingData } from '../types/nowplaying';
import { fetchNowPlaying } from '../services/api';
import { connectSSE } from '../services/sse';
import { subscribeMock } from '../services/mock';
import { fetchCoverArt } from '../services/coverArt';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATION = import.meta.env.VITE_STATION_SHORTCODE;
const POLL_INTERVAL = 15_000;

function isGenericArt(art: string | undefined): boolean {
  if (!art) return true;
  return art.includes('generic') || art.includes('placeholder') || art.endsWith('/albumart');
}

async function enrichWithCoverArt(np: NowPlayingData): Promise<NowPlayingData> {
  const song = np.now_playing.song;
  if (isGenericArt(song.art) && song.artist && song.title) {
    const coverUrl = await fetchCoverArt(song.artist, song.title);
    if (coverUrl) {
      return {
        ...np,
        now_playing: {
          ...np.now_playing,
          song: { ...song, art: coverUrl },
        },
      };
    }
  }

  // Also enrich history
  const enrichedHistory = await Promise.all(
    np.song_history.map(async (entry) => {
      if (isGenericArt(entry.song.art) && entry.song.artist && entry.song.title) {
        const coverUrl = await fetchCoverArt(entry.song.artist, entry.song.title);
        if (coverUrl) {
          return { ...entry, song: { ...entry.song, art: coverUrl } };
        }
      }
      return entry;
    })
  );

  return { ...np, song_history: enrichedHistory };
}

export function useNowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (USE_MOCK) {
      const unsubscribe = subscribeMock((np) => {
        enrichWithCoverArt(np).then((enriched) => {
          setData(enriched);
          setIsLoading(false);
        });
      });
      cleanupRef.current = unsubscribe;
      return unsubscribe;
    }

    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    // Initial fetch
    fetchNowPlaying()
      .then((np) => enrichWithCoverArt(np))
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
        enrichWithCoverArt(np).then((enriched) => {
          if (!cancelled) {
            setData(enriched);
            setIsLoading(false);
            setError(null);
          }
        });
      });
      cleanupRef.current = closeSSE;
    } catch {
      pollTimer = setInterval(async () => {
        try {
          const np = await fetchNowPlaying();
          const enriched = await enrichWithCoverArt(np);
          if (!cancelled) {
            setData(enriched);
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
