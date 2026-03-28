import type { ScheduleEntry } from '../types/schedule';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATION = import.meta.env.VITE_STATION_SHORTCODE;

export async function fetchSchedule(): Promise<ScheduleEntry[]> {
  const res = await fetch(`${BASE_URL}/api/station/${STATION}/schedule`);
  if (!res.ok) throw new Error(`Schedule API error: ${res.status}`);
  return res.json();
}
