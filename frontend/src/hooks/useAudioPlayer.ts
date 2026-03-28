import { useState, useRef, useCallback } from 'react';
import { useAnnouncements } from './useAnnouncements';

const VOLUME_KEY = 'kutsho-radio-volume';

export function useAudioPlayer(streamUrl: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved ? parseFloat(saved) : 0.7;
  });

  const play = useCallback(() => {
    if (!streamUrl) return;

    // Create a fresh audio element every time to avoid stale state
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;
    audio.src = streamUrl;
    audioRef.current = audio;

    setIsBuffering(true);

    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsBuffering(false);
    }, { once: true });

    audio.addEventListener('error', () => {
      setIsPlaying(false);
      setIsBuffering(false);
    }, { once: true });

    audio.play().catch(() => {
      setIsBuffering(false);
    });
  }, [streamUrl, volume]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = '';
    audioRef.current = null;
    setIsPlaying(false);
    setIsBuffering(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    localStorage.setItem(VOLUME_KEY, String(clamped));
  }, []);

  useAnnouncements({ audioRef, isPlaying, volume });

  return { isPlaying, isBuffering, volume, play, pause, toggle, setVolume };
}
