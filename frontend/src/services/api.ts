import type { NowPlayingData } from '../types/nowplaying';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATION = import.meta.env.VITE_STATION_SHORTCODE;

export async function fetchNowPlaying(): Promise<NowPlayingData> {
  const res = await fetch(`${BASE_URL}/api/nowplaying/${STATION}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
