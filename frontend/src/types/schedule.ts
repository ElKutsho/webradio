export interface ScheduleEntry {
  id: number;
  type: string;
  name: string;
  title: string;
  description: string;
  start_timestamp: number;
  start: string;
  end_timestamp: number;
  end: string;
  is_now: boolean;
}
