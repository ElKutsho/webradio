export interface NowPlayingData {
  station: Station;
  listeners: Listeners;
  live: LiveStatus;
  now_playing: CurrentSong;
  song_history: SongHistoryEntry[];
  is_online: boolean;
}

export interface Station {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  listen_url: string;
  url: string;
  is_public: boolean;
  mounts: Mount[];
}

export interface Mount {
  id: number;
  name: string;
  url: string;
  bitrate: number;
  format: string;
  listeners: MountListeners;
  path: string;
  is_default: boolean;
}

export interface MountListeners {
  total: number;
  unique: number;
  current: number;
}

export interface Listeners {
  total: number;
  unique: number;
  current: number;
}

export interface LiveStatus {
  is_live: boolean;
  streamer_name: string;
  broadcast_start: number | null;
  art: string | null;
}

export interface Song {
  id: string;
  art: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
}

export interface CurrentSong {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: Song;
  elapsed: number;
  remaining: number;
}

export interface SongHistoryEntry {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: Song;
}
