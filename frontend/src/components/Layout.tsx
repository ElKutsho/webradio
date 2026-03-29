import { type ReactNode } from 'react';
import { usePlayer } from '../context/PlayerContext';

export function Layout({ children }: { children: ReactNode }) {
  const { nowPlaying } = usePlayer();
  const artUrl = nowPlaying?.now_playing?.song?.art;

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
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ background: `linear-gradient(to right, var(--accent, #a78bfa), var(--accent-light, #c4b5fd), var(--accent, #a78bfa))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
            <div className="w-8 h-px" style={{ background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--accent, #a78bfa) 40%, transparent))` }} />
            <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Tune Into Your Dreams</p>
            <div className="w-8 h-px" style={{ background: `linear-gradient(to left, transparent, color-mix(in srgb, var(--accent, #a78bfa) 40%, transparent))` }} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
