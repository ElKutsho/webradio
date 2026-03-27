import { createContext, useContext, type ReactNode } from 'react';
import { useNowPlaying } from '../hooks/useNowPlaying';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import type { NowPlayingData } from '../types/nowplaying';

interface PlayerContextValue {
  nowPlaying: NowPlayingData | null;
  isLoading: boolean;
  error: Error | null;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useNowPlaying();
  const streamUrl = data?.station.listen_url;
  const player = useAudioPlayer(streamUrl);

  return (
    <PlayerContext.Provider
      value={{
        nowPlaying: data,
        isLoading,
        error,
        ...player,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
