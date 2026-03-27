import type { NowPlayingData, Song } from '../types/nowplaying';

const MOCK_SONGS: Song[] = [
  {
    id: '1',
    art: '',
    text: 'Boards of Canada - Dayvan Cowboy',
    artist: 'Boards of Canada',
    title: 'Dayvan Cowboy',
    album: 'The Campfire Headphase',
    genre: 'Electronic',
  },
  {
    id: '2',
    art: '',
    text: 'Tycho - Awake',
    artist: 'Tycho',
    title: 'Awake',
    album: 'Awake',
    genre: 'Ambient',
  },
  {
    id: '3',
    art: '',
    text: 'Bonobo - Kerala',
    artist: 'Bonobo',
    title: 'Kerala',
    album: 'Migration',
    genre: 'Electronic',
  },
  {
    id: '4',
    art: '',
    text: 'Four Tet - Two Thousand and Seventeen',
    artist: 'Four Tet',
    title: 'Two Thousand and Seventeen',
    album: 'New Energy',
    genre: 'Electronic',
  },
  {
    id: '5',
    art: '',
    text: 'Floating Points - Silhouettes',
    artist: 'Floating Points',
    title: 'Silhouettes',
    album: 'Crush',
    genre: 'Electronic',
  },
];

const SONG_DURATION = 240; // 4 minutes

type MockListener = (data: NowPlayingData) => void;

let currentIndex = 0;
let elapsed = 0;
let listeners: MockListener[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;
let isLive = false;

function buildNowPlaying(): NowPlayingData {
  const song = MOCK_SONGS[currentIndex];
  const listenerCount = 12 + Math.floor(Math.random() * 20);

  return {
    station: {
      id: 1,
      name: 'Kutsho Radio',
      shortcode: 'kutsho_radio',
      description: 'Webradio für kutsho.com',
      listen_url: 'http://localhost:8000/radio.mp3',
      url: 'http://localhost:8080',
      is_public: true,
      mounts: [
        {
          id: 1,
          name: '/radio.mp3',
          url: 'http://localhost:8000/radio.mp3',
          bitrate: 192,
          format: 'mp3',
          listeners: { total: listenerCount, unique: listenerCount, current: listenerCount },
          path: '/radio.mp3',
          is_default: true,
        },
      ],
    },
    listeners: { total: listenerCount, unique: listenerCount, current: listenerCount },
    live: {
      is_live: isLive,
      streamer_name: isLive ? 'DJ Kutsho' : '',
      broadcast_start: isLive ? Date.now() / 1000 - 600 : null,
      art: null,
    },
    now_playing: {
      sh_id: currentIndex + 1,
      played_at: Math.floor(Date.now() / 1000) - elapsed,
      duration: SONG_DURATION,
      playlist: 'Default Playlist',
      streamer: '',
      is_request: false,
      song,
      elapsed,
      remaining: SONG_DURATION - elapsed,
    },
    song_history: MOCK_SONGS.filter((_, i) => i !== currentIndex)
      .slice(0, 3)
      .map((s, i) => ({
        sh_id: 100 + i,
        played_at: Math.floor(Date.now() / 1000) - SONG_DURATION * (i + 1),
        duration: SONG_DURATION,
        playlist: 'Default Playlist',
        streamer: '',
        is_request: false,
        song: s,
      })),
    is_online: true,
  };
}

function tick() {
  elapsed += 5;
  if (elapsed >= SONG_DURATION) {
    currentIndex = (currentIndex + 1) % MOCK_SONGS.length;
    elapsed = 0;
  }
  const data = buildNowPlaying();
  listeners.forEach((cb) => cb(data));
}

function ensureRunning() {
  if (!intervalId) {
    // Toggle live DJ every 2 minutes for demo
    setInterval(() => {
      isLive = !isLive;
    }, 120_000);

    intervalId = setInterval(tick, 5000);
  }
}

export function subscribeMock(callback: MockListener): () => void {
  listeners.push(callback);
  ensureRunning();

  // Send initial data immediately
  callback(buildNowPlaying());

  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
    if (listeners.length === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

export function getMockNowPlaying(): NowPlayingData {
  return buildNowPlaying();
}
