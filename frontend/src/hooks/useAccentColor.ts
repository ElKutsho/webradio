import { useEffect, useRef } from 'react';

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color))).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function extractDominantColor(img: HTMLImageElement): string | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const size = 64;
  canvas.width = size;
  canvas.height = size;

  try {
    ctx.drawImage(img, 0, 0, size, size);
  } catch {
    return null;
  }

  const data = ctx.getImageData(0, 0, size, size).data;

  // Bucket colors into groups and find the most vibrant dominant color
  const buckets = new Map<string, { r: number; g: number; b: number; count: number; saturation: number }>();

  for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 128) continue; // skip transparent

    const [h, s, l] = rgbToHsl(r, g, b);
    // Skip very dark, very light, or very desaturated colors
    if (l < 0.15 || l > 0.85 || s < 0.2) continue;

    // Quantize to reduce buckets
    const key = `${Math.round(h / 15)}-${Math.round(s * 4)}-${Math.round(l * 4)}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count++;
      existing.saturation += s;
    } else {
      buckets.set(key, { r, g, b, count: 1, saturation: s });
    }
  }

  if (buckets.size === 0) return null;

  // Pick the bucket with highest (count * saturation) score - prefers vibrant + common colors
  let best = { r: 139, g: 92, b: 246, score: 0 }; // fallback purple
  for (const bucket of buckets.values()) {
    const score = bucket.count * (bucket.saturation / bucket.count);
    if (score > best.score) {
      best = {
        r: Math.round(bucket.r / bucket.count),
        g: Math.round(bucket.g / bucket.count),
        b: Math.round(bucket.b / bucket.count),
        score,
      };
    }
  }

  const [h, s, l] = rgbToHsl(best.r, best.g, best.b);
  // Ensure the accent is vibrant enough
  const clampedS = Math.max(s, 0.5);
  const clampedL = Math.min(Math.max(l, 0.4), 0.6);
  return hslToHex(h, clampedS, clampedL);
}

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const [h, s, l] = rgbToHsl(r, g, b);
  return hslToHex(h, s, Math.min(l + amount, 0.85));
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const [h, s, l] = rgbToHsl(r, g, b);
  return hslToHex(h, s, Math.max(l - amount, 0.15));
}

export function useAccentColor(artUrl: string | undefined) {
  const lastUrl = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!artUrl || artUrl === lastUrl.current) return;
    lastUrl.current = artUrl;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const color = extractDominantColor(img);
      if (color) {
        const root = document.documentElement;
        root.style.setProperty('--accent', color);
        root.style.setProperty('--accent-light', lighten(color, 0.15));
        root.style.setProperty('--accent-dark', darken(color, 0.15));
      }
    };
    img.src = artUrl;
  }, [artUrl]);
}
