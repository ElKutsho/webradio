import { usePlayer } from '../context/PlayerContext';

export function LiveDJIndicator() {
  const { nowPlaying } = usePlayer();

  if (!nowPlaying?.live.is_live) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <span className="text-red-400 text-sm font-semibold uppercase tracking-wide">Live</span>
      {nowPlaying.live.streamer_name && (
        <span className="text-red-300/70 text-sm">{nowPlaying.live.streamer_name}</span>
      )}
    </div>
  );
}
