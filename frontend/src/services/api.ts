import type { NowPlayingData } from '../types/nowplaying';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATION = import.meta.env.VITE_STATION_SHORTCODE;

/** Strip absolute URLs from AzuraCast so art/listen paths go through our nginx proxy */
function rewriteUrl(url: string): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    // Return just the path so it goes through nginx proxy
    return parsed.pathname + parsed.search;
  } catch {
    // Already relative or invalid - return as-is
    return url;
  }
}

function rewriteNowPlaying(data: NowPlayingData): NowPlayingData {
  return {
    ...data,
    station: {
      ...data.station,
      listen_url: rewriteUrl(data.station.listen_url),
      mounts: data.station.mounts.map((m) => ({ ...m, url: rewriteUrl(m.url) })),
    },
    now_playing: {
      ...data.now_playing,
      song: { ...data.now_playing.song, art: rewriteUrl(data.now_playing.song.art) },
    },
    live: {
      ...data.live,
      art: data.live.art ? rewriteUrl(data.live.art) : null,
    },
    song_history: data.song_history.map((entry) => ({
      ...entry,
      song: { ...entry.song, art: rewriteUrl(entry.song.art) },
    })),
  };
}

export async function fetchNowPlaying(): Promise<NowPlayingData> {
  const res = await fetch(`${BASE_URL}/api/nowplaying/${STATION}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return rewriteNowPlaying(data);
}

export { rewriteNowPlaying };
