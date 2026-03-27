const cache = new Map<string, string | null>();

export async function fetchCoverArt(artist: string, title: string): Promise<string | null> {
  const key = `${artist}::${title}`.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const result = data.results?.[0];
    if (!result?.artworkUrl100) {
      cache.set(key, null);
      return null;
    }

    // Upscale from 100x100 to 600x600
    const artUrl = result.artworkUrl100.replace('100x100bb', '600x600bb');
    cache.set(key, artUrl);
    return artUrl;
  } catch {
    cache.set(key, null);
    return null;
  }
}
