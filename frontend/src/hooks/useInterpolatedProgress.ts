import { useState, useEffect, useRef } from 'react';

interface ProgressInput {
  elapsed: number;
  duration: number;
  songId: number;
  isPlaying: boolean;
}

export function useInterpolatedProgress({
  elapsed,
  duration,
  songId,
  isPlaying,
}: ProgressInput) {
  const [localElapsed, setLocalElapsed] = useState(elapsed);
  const lastServerElapsedRef = useRef(elapsed);
  const lastSongIdRef = useRef(songId);

  // Sync from server data
  useEffect(() => {
    if (songId !== lastSongIdRef.current) {
      setLocalElapsed(elapsed);
      lastSongIdRef.current = songId;
      lastServerElapsedRef.current = elapsed;
      return;
    }

    if (elapsed !== lastServerElapsedRef.current) {
      setLocalElapsed(elapsed);
      lastServerElapsedRef.current = elapsed;
    }
  }, [elapsed, songId]);

  // Client-side tick every second
  useEffect(() => {
    if (!isPlaying || duration <= 0) return;

    const interval = setInterval(() => {
      setLocalElapsed((prev) => {
        const next = prev + 1;
        return next >= duration ? duration : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, songId]);

  const progress = duration > 0 ? Math.min((localElapsed / duration) * 100, 100) : 0;

  return { interpolatedElapsed: localElapsed, progress };
}
