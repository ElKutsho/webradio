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
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-violet-300 to-purple-500 bg-clip-text text-transparent">
              RADIO KUTSHO
            </h1>
            {nowPlaying?.live?.is_live && (
              <span className="live-badge flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-400/40" />
            <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Tune Into Your Dreams</p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-purple-400/40" />
          </div>
          <button
            onClick={() => setScheduleOpen(true)}
            className="text-white/30 hover:text-purple-400 transition-colors mt-1"
            aria-label="Show schedule"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </button>
        </div>
        {children}
      </div>

      <SchedulePopup isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </main>
  );
}
