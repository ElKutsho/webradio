import { type ReactNode } from 'react';
import { usePlayer } from '../context/PlayerContext';

export function Layout({ children }: { children: ReactNode }) {
  const { nowPlaying } = usePlayer();
  const artUrl = nowPlaying?.now_playing?.song?.art;
  const isLive = nowPlaying?.live?.is_live;

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
        {/* Logo */}
        <div className="flex flex-col items-center gap-0 logo-wrapper relative">
          {/* LIVE badge - floats top-right of logo */}
          {isLive && (
            <span className="live-badge absolute -top-3 -right-14 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
              <span className="text-red-400 text-[9px] font-bold uppercase tracking-widest">Live</span>
            </span>
          )}

          {/* RADIO - small, airy, spaced out */}
          <span className="text-[11px] font-medium tracking-[0.5em] uppercase text-white/30 mb-1">
            Radio
          </span>

          {/* Animated soundwave divider */}
          <div className="flex items-center gap-[2px] h-3 my-1">
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '0ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '150ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '300ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '100ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '250ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '50ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '200ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '350ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
            <span className="w-[1.5px] rounded-full logo-wave" style={{ animationDelay: '120ms', backgroundColor: 'var(--accent, #a78bfa)' }} />
          </div>

          {/* KUTSHO - big, bold, glowing */}
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight logo-text"
            style={{
              background: `linear-gradient(180deg, var(--accent-light, #c4b5fd) 0%, var(--accent, #a78bfa) 50%, var(--accent-dark, #7c3aed) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 20px color-mix(in srgb, var(--accent, #a78bfa) 30%, transparent))`,
            }}
          >
            KUTSHO
          </h1>

          {/* Tagline */}
          <p className="text-white/15 text-[9px] tracking-[0.4em] uppercase mt-2">Tune Into Your Dreams</p>
        </div>

        {children}
      </div>
    </main>
  );
}
