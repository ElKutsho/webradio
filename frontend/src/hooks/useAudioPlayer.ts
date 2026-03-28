import { useState, useEffect, useRef, useCallback } from 'react';
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

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsBuffering(false);
    });
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('waiting', () => setIsBuffering(true));
    audio.addEventListener('canplay', () => setIsBuffering(false));
    audio.addEventListener('error', () => {
      setIsPlaying(false);
      setIsBuffering(false);
    });

    audio.volume = volume;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Update source when stream URL changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (audio.src !== streamUrl) {
      const wasPlaying = isPlaying;
      audio.src = streamUrl;
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [streamUrl]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (!audio.src || audio.src === '') {
      audio.src = streamUrl;
    }
    setIsBuffering(true);
    audio.play().catch(() => setIsBuffering(false));
  }, [streamUrl]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    // Reset source to stop buffering the stream
    audio.src = '';
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
