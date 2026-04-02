import { useState, useRef, useCallback, useEffect } from 'react';
import { useAnnouncements } from './useAnnouncements';
import { useAudioDevices } from './useAudioDevices';
import { useSonos } from './useSonos';

const VOLUME_KEY = 'kutsho-radio-volume';

export function useAudioPlayer(streamUrl: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved ? parseFloat(saved) : 0.7;
  });

  const audioDevices = useAudioDevices();
  const sonos = useSonos();

  // Apply setSinkId when device changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if ('setSinkId' in audio && typeof (audio as any).setSinkId === 'function') {
      (audio as any).setSinkId(audioDevices.selectedDeviceId).catch(() => {});
    }
  }, [audioDevices.selectedDeviceId]);

  const playLocal = useCallback(() => {
    if (!streamUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;

    if ('setSinkId' in audio && typeof (audio as any).setSinkId === 'function') {
      (audio as any).setSinkId(audioDevices.selectedDeviceId).catch(() => {});
    }

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
  }, [streamUrl, volume, audioDevices.selectedDeviceId]);

  const playSonos = useCallback((zoneName: string) => {
    if (!streamUrl) return;

    const absoluteUrl = streamUrl.startsWith('http')
      ? streamUrl
      : `${window.location.origin}${streamUrl}`;

    sonos.playOnSonos(zoneName, absoluteUrl);
    setIsPlaying(true);
    setIsBuffering(false);
  }, [streamUrl, sonos]);

  const play = useCallback(() => {
    if (!streamUrl) return;

    // If Sonos is active, play on Sonos
    if (sonos.activeZone) {
      playSonos(sonos.activeZone);
      return;
    }

    playLocal();
  }, [streamUrl, sonos.activeZone, playLocal, playSonos]);

  const pause = useCallback(() => {
    // If Sonos is active, pause on Sonos
    if (sonos.activeZone) {
      sonos.pauseOnSonos(sonos.activeZone);
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = '';
    audioRef.current = null;
    setIsPlaying(false);
    setIsBuffering(false);
  }, [sonos]);

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
    // Also set volume on Sonos (0-100 scale)
    if (sonos.activeZone) {
      sonos.setVolumeOnSonos(sonos.activeZone, clamped * 100);
    }
    localStorage.setItem(VOLUME_KEY, String(clamped));
  }, [sonos]);

  // Switch to a browser output device
  const selectBrowserDevice = useCallback((deviceId: string) => {
    // If Sonos was active, stop it and resume local playback
    if (sonos.activeZone) {
      sonos.pauseOnSonos(sonos.activeZone);
    }
    audioDevices.selectDevice(deviceId);

    // If was playing, restart with new device
    if (isPlaying && streamUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio();
      audio.preload = 'none';
      audio.volume = volume;
      if ('setSinkId' in audio && typeof (audio as any).setSinkId === 'function') {
        (audio as any).setSinkId(deviceId).catch(() => {});
      }
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
      audio.play().catch(() => setIsBuffering(false));
    }
  }, [sonos, audioDevices, isPlaying, streamUrl, volume]);

  // Switch to a Sonos speaker
  const selectSonosZone = useCallback((zoneName: string) => {
    if (!streamUrl) return;

    // Stop local playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    playSonos(zoneName);
  }, [streamUrl, playSonos]);

  useAnnouncements({ audioRef, isPlaying, volume });

  return {
    isPlaying,
    isBuffering,
    volume,
    play,
    pause,
    toggle,
    setVolume,
    // Device selection
    audioDevices,
    sonos,
    selectBrowserDevice,
    selectSonosZone,
  };
}
