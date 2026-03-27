import { usePlayer } from '../context/PlayerContext';

export function NowPlaying() {
  const { nowPlaying, isLoading, isPlaying } = usePlayer();

  if (isLoading || !nowPlaying) {
    return (
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="w-72 h-72 md:w-80 md:h-80 bg-white/5 rounded-3xl" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-48 h-6 bg-white/5 rounded-lg" />
          <div className="w-32 h-4 bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  const { song, elapsed, duration } = nowPlaying.now_playing;
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Album Art */}
      <div className="relative group">
        <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
          {song.art ? (
            <img
              src={song.art}
              alt={`${song.artist} - ${song.title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-zinc-900 flex items-center justify-center">
              <svg className={`w-20 h-20 text-white/20 ${isPlaying ? 'vinyl-spin' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
                <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.2" />
                <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
                <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.6" />
              </svg>
            </div>
          )}
        </div>

        {/* Playing indicator dots */}
        {isPlaying && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse [animation-delay:300ms]" />
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="text-center mt-2 max-w-full px-2">
        <h2 className="text-lg md:text-xl font-bold text-white leading-tight truncate">
          {song.title}
        </h2>
        <p className="text-white/50 text-sm mt-1 truncate">{song.artist}</p>
        {song.album && (
          <p className="text-white/30 text-xs mt-0.5 truncate">{song.album}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-white/30 mt-1.5 font-mono">
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
