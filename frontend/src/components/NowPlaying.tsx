import { usePlayer } from '../context/PlayerContext';

export function NowPlaying() {
  const { nowPlaying, isLoading } = usePlayer();

  if (isLoading || !nowPlaying) {
    return (
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-64 h-64 bg-white/10 rounded-2xl" />
        <div className="w-48 h-6 bg-white/10 rounded" />
        <div className="w-32 h-4 bg-white/10 rounded" />
      </div>
    );
  }

  const { song, elapsed, duration } = nowPlaying.now_playing;
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Album Art */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl bg-white/5">
        {song.art ? (
          <img
            src={song.art}
            alt={`${song.artist} - ${song.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
            ♪
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white">{song.title}</h2>
        <p className="text-white/60 mt-1">{song.artist}</p>
        {song.album && (
          <p className="text-white/40 text-sm mt-0.5">{song.album}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-64 md:w-80">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
