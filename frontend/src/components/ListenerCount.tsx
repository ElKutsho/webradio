import { usePlayer } from '../context/PlayerContext';

export function ListenerCount() {
  const { nowPlaying } = usePlayer();

  if (!nowPlaying) return null;

  const count = nowPlaying.listeners.current;

  return (
    <div className="flex items-center gap-1.5 text-white/20 text-[11px] tracking-wide">
      <div className="flex -space-x-1">
        <div className="w-3 h-3 rounded-full bg-white/10 ring-1 ring-black/20" />
        {count > 1 && <div className="w-3 h-3 rounded-full bg-white/[0.07] ring-1 ring-black/20" />}
        {count > 2 && <div className="w-3 h-3 rounded-full bg-white/[0.05] ring-1 ring-black/20" />}
      </div>
      <span>{count} {count === 1 ? 'Listener' : 'Listeners'}</span>
    </div>
  );
}
