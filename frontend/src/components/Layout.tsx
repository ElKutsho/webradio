import { useState, type ReactNode } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { SchedulePopup } from './SchedulePopup';

export function Layout({ children }: { children: ReactNode }) {
  const { nowPlaying } = usePlayer();
  const artUrl = nowPlaying?.now_playing?.song?.art;
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32 pt-8 relative overflow-hidden">
      {/* Background glow effect from album art */}
      {artUrl && (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <img
            src={artUrl}
            alt=""
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] object-cover blur-[150px] opacity-25 album-glow"
          />
          <div className="absolute inset-0 bg-[#0a0a0f]/50" />
        </div>
      )}

      <div className="w-full max-w-md flex flex-col items-center gap-10">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-white/80 text-xs font-medium tracking-[0.4em] uppercase">
              Kutsho Radio
            </h1>
            <button
              onClick={() => setScheduleOpen(true)}
              className="text-white/20 hover:text-white/50 transition-colors"
              aria-label="Show schedule"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </button>
          </div>
          <div className="w-6 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </div>
        {children}
      </div>

      <SchedulePopup isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </main>
  );
}
