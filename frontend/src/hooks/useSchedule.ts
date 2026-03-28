import { useState, useCallback } from 'react';
import type { ScheduleEntry } from '../types/schedule';
import { fetchSchedule } from '../services/schedule';

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSchedule();
      setSchedule(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { schedule, isLoading, error, load };
}
