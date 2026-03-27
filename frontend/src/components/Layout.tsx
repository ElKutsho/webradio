import type { ReactNode } from 'react';
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
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-white/80 text-xs font-medium tracking-[0.4em] uppercase">
            Kutsho Radio
          </h1>
          <div className="w-6 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </div>
        {children}
      </div>
    </main>
  );
}
