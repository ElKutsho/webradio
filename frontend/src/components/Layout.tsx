import type { ReactNode } from 'react';
import { usePlayer } from '../context/PlayerContext';

export function Layout({ children }: { children: ReactNode }) {
  const { nowPlaying } = usePlayer();
  const artUrl = nowPlaying?.now_playing?.song?.art;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 pb-28 relative overflow-hidden">
      {/* Background glow effect from album art */}
      {artUrl && (
        <div className="absolute inset-0 -z-10">
          <img
            src={artUrl}
            alt=""
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-cover blur-[120px] opacity-30 album-glow"
          />
          <div className="absolute inset-0 bg-[#09090b]/60" />
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-white/90 text-sm font-semibold tracking-[0.3em] uppercase">
            Kutsho Radio
          </h1>
          <div className="w-8 h-0.5 bg-purple-500/50 rounded-full" />
        </div>
        {children}
      </div>
    </main>
  );
}
