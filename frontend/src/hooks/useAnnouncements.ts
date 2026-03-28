import { useEffect, useRef, useCallback } from 'react';

// Map of 24h time (HH:MM) to filename
const ANNOUNCEMENTS: Record<string, string> = {
  '00:00': '00.00AM.mp3',
  '00:30': '00.30AM.mp3',
  '01:00': '1.00AM.mp3',
  '01:30': '1.30AM.mp3',
  '02:00': '2.00AM.mp3',
  '02:30': '2.30AM.mp3',
  '03:00': '3.00AM.mp3',
  '03:30': '3.30AM.mp3',
  '04:00': '4.00AM.mp3',
  '04:30': '4.30AM.mp3',
  '05:00': '5.00AM.mp3',
  '05:30': '5.30AM.mp3',
  '06:00': '6.00AM.mp3',
  '06:30': '6.30AM.mp3',
  '07:00': '7.00AM.mp3',
  '07:30': '7.30AM.mp3',
  '08:30': '8.30AM.mp3',
  '09:00': '9.00AM.mp3',
  '09:30': '9.30AM.mp3',
  '10:00': '10.00AM.mp3',
  '10:30': '10.30AM.mp3',
  '11:00': '11.00AM.mp3',
  '11:30': '11.30AM.mp3',
  '12:00': '12.00PM.mp3',
  '12:30': '12.30PM.mp3',
  '13:00': '1.00PM.mp3',
  '13:30': '1.30PM.mp3',
  '14:00': '2.00PM.mp3',
  '14:30': '2.30PM.mp3',
  '15:00': '3.00PM.mp3',
  '15:30': '3.30PM.mp3',
  '16:00': '4.00PM.mp3',
  '16:30': '4.30PM.mp3',
  '17:00': '5.00PM.mp3',
  '17:30': '5.30PM.mp3',
  '18:00': '6.00PM.mp3',
  '18:30': '6.30PM.mp3',
  '19:00': '7.00PM.mp3',
  '19:30': '7.30PM.mp3',
  '20:00': '8.00PM.mp3',
  '20:30': '8.30PM.mp3',
  '21:00': '9.00PM.mp3',
  '21:30': '9.30PM.mp3',
  '22:00': '10.00PM.mp3',
  '22:30': '10.30PM.mp3',
  '23:00': '11.00PM.mp3',
  '23:30': '11.30PM.mp3',
};

const DUCK_VOLUME = 0.15;
const FADE_DURATION = 2000; // 2 seconds
const FADE_STEPS = 40; // smooth fade in 50ms increments

interface UseAnnouncementsOptions {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  volume: number;
}

export function useAnnouncements({ audioRef, isPlaying, volume }: UseAnnouncementsOptions) {
  const announcementAudioRef = useRef<HTMLAudioElement | null>(null);
  const isAnnouncingRef = useRef(false);
  const lastAnnouncedRef = useRef('');
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fadeTo = useCallback((targetVolume: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) {
      onDone?.();
      return;
    }

    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);

    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    const stepTime = FADE_DURATION / FADE_STEPS;
    let step = 0;

    fadeTimerRef.current = setInterval(() => {
      step++;
      if (step >= FADE_STEPS) {
        audio.volume = targetVolume;
        if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
        onDone?.();
      } else {
        audio.volume = startVolume + diff * (step / FADE_STEPS);
      }
    }, stepTime);
  }, [audioRef]);

  const playAnnouncement = useCallback((filename: string) => {
    if (isAnnouncingRef.current) return;
    isAnnouncingRef.current = true;

    // Create announcement audio element
    if (!announcementAudioRef.current) {
      announcementAudioRef.current = new Audio();
    }
    const announcement = announcementAudioRef.current;
    announcement.src = `/announcements/${filename}`;
    announcement.volume = 1;

    // Step 1: Fade radio down
    fadeTo(DUCK_VOLUME, () => {
      // Step 2: Play announcement
      announcement.play().catch(() => {
        // If playback fails, restore volume
        fadeTo(volume);
        isAnnouncingRef.current = false;
      });
    });

    // Step 3: When announcement ends, fade radio back up
    announcement.onended = () => {
      fadeTo(volume, () => {
        isAnnouncingRef.current = false;
      });
    };

    announcement.onerror = () => {
      fadeTo(volume);
      isAnnouncingRef.current = false;
    };
  }, [fadeTo, volume]);

  useEffect(() => {
    if (!isPlaying) return;

    const check = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeKey = `${hours}:${minutes}`;

      // Trigger at second 58 (2 seconds before the target minute)
      // For :00 and :30 announcements, we check the NEXT minute
      if (seconds === 58 && !isAnnouncingRef.current) {
        const nextMinute = new Date(now.getTime() + 2000);
        const nextHours = nextMinute.getHours().toString().padStart(2, '0');
        const nextMinutes = nextMinute.getMinutes().toString().padStart(2, '0');
        const nextTimeKey = `${nextHours}:${nextMinutes}`;
        const filename = ANNOUNCEMENTS[nextTimeKey];

        if (filename && lastAnnouncedRef.current !== nextTimeKey) {
          lastAnnouncedRef.current = nextTimeKey;
          playAnnouncement(filename);
        }
      }

      // Also trigger at second 0 as fallback (in case we missed second 58)
      if (seconds === 0 && !isAnnouncingRef.current) {
        const filename = ANNOUNCEMENTS[timeKey];
        if (filename && lastAnnouncedRef.current !== timeKey) {
          lastAnnouncedRef.current = timeKey;
          playAnnouncement(filename);
        }
      }
    };

    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, playAnnouncement]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      if (announcementAudioRef.current) {
        announcementAudioRef.current.pause();
        announcementAudioRef.current.src = '';
      }
    };
  }, []);
}
