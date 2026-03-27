import { usePlayer } from '../context/PlayerContext';

export function LiveDJIndicator() {
  const { nowPlaying } = usePlayer();

  if (!nowPlaying?.live.is_live) return null;

  return (
    <div className="flex items-center gap-2.5 px-4 py-2 glass-card !rounded-full !border-red-500/20 bg-red-500/10">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live</span>
      {nowPlaying.live.streamer_name && (
        <>
          <span className="text-white/10">|</span>
          <span className="text-red-300/60 text-xs font-medium">{nowPlaying.live.streamer_name}</span>
        </>
      )}
    </div>
  );
}
