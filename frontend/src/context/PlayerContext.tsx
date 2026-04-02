import { createContext, useContext, type ReactNode } from 'react';
import { useNowPlaying } from '../hooks/useNowPlaying';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import type { NowPlayingData } from '../types/nowplaying';
import type { AudioOutputDevice } from '../hooks/useAudioDevices';
import type { SonosZone } from '../hooks/useSonos';

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
  // Device selection
  browserDevices: AudioOutputDevice[];
  selectedDeviceId: string;
  sonosZones: SonosZone[];
  sonosAvailable: boolean;
  sonosDiscovering: boolean;
  activeSonosZone: string | null;
  selectBrowserDevice: (id: string) => void;
  selectSonosZone: (name: string) => void;
  refreshSonos: () => void;
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
        isPlaying: player.isPlaying,
        isBuffering: player.isBuffering,
        volume: player.volume,
        play: player.play,
        pause: player.pause,
        toggle: player.toggle,
        setVolume: player.setVolume,
        // Device selection
        browserDevices: player.audioDevices.devices,
        selectedDeviceId: player.audioDevices.selectedDeviceId,
        sonosZones: player.sonos.zones,
        sonosAvailable: player.sonos.available,
        sonosDiscovering: player.sonos.isDiscovering,
        activeSonosZone: player.sonos.activeZone,
        selectBrowserDevice: player.selectBrowserDevice,
        selectSonosZone: player.selectSonosZone,
        refreshSonos: player.sonos.discover,
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
