import type { NowPlayingData } from '../types/nowplaying';
import { rewriteNowPlaying } from './api';

export function connectSSE(
  baseUrl: string,
  stationShortcode: string,
  onUpdate: (data: NowPlayingData) => void
): () => void {
  const subs = { [`station:${stationShortcode}`]: { recover: true } };
  const params = new URLSearchParams({
    cf_connect: JSON.stringify({ subs }),
  });
  const sse = new EventSource(`${baseUrl}/api/live/nowplaying/sse?${params}`);

  sse.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data);

      // Initial connection data
      if ('connect' in json && json.connect?.data) {
        for (const row of json.connect.data) {
          if (row?.pub?.data?.np) {
            onUpdate(rewriteNowPlaying(row.pub.data.np));
          }
        }
      }

      // Live updates
      if ('pub' in json && json.pub?.data?.np) {
        onUpdate(rewriteNowPlaying(json.pub.data.np));
      }
    } catch {
      // Ignore parse errors
    }
  };

  return () => sse.close();
}
