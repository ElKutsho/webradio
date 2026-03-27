import { usePlayer } from '../context/PlayerContext';

export function AudioPlayer() {
  const { isPlaying, isBuffering, volume, toggle, setVolume, nowPlaying } = usePlayer();

  if (!nowPlaying) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-white/[0.04]">
      <div className="max-w-screen-md mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* Song info (compact) */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden ring-1 ring-white/[0.06]">
            {nowPlaying.now_playing.song.art ? (
              <img
                src={nowPlaying.now_playing.song.art}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-zinc-900">
                <svg className="w-4 h-4 text-white/15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-white/90 font-medium truncate">
              {nowPlaying.now_playing.song.title}
            </div>
            <div className="text-xs text-white/30 truncate">
              {nowPlaying.now_playing.song.artist}
            </div>
          </div>
        </div>

        {/* Play/Pause */}
        <button
          onClick={toggle}
          className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-purple-500/20"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {/* Glow ring */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          )}
          <div className="relative z-10">
            {isBuffering ? (
              <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </button>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {volume === 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              )}
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20"
            aria-label="Volume"
          />
        </div>

        {/* Mobile volume toggle */}
        <button
          onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
          className="sm:hidden text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
          aria-label={volume > 0 ? 'Mute' : 'Unmute'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {volume === 0 ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
