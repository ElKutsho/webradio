import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useInterpolatedProgress } from '../hooks/useInterpolatedProgress';
import vinylImg from '../assets/vynil.png';

export function NowPlaying() {
  const { nowPlaying, isLoading, isPlaying } = usePlayer();

  const npData = nowPlaying?.now_playing;
  const { interpolatedElapsed, progress } = useInterpolatedProgress({
    elapsed: npData?.elapsed ?? 0,
    duration: npData?.duration ?? 0,
    songId: npData?.sh_id ?? 0,
    isPlaying,
  });

  if (isLoading || !nowPlaying) {
    return (
      <div className="flex flex-col items-center gap-8 animate-pulse">
        <div className="w-64 h-64 md:w-72 md:h-72 bg-white/5 rounded-2xl" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-5 bg-white/5 rounded-lg" />
          <div className="w-32 h-4 bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  const { song, duration } = nowPlaying.now_playing;

  return (
    <div className="flex flex-col items-center gap-8 w-full fade-in-up">
      {/* Album Art with Vinyl Effect */}
      <div className="relative group">
        {/* Vinyl record behind cover */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 rounded-full bg-zinc-900 transition-all duration-700 ease-out ${
            isPlaying ? 'left-[25%] opacity-100' : 'left-[10%] opacity-0'
          }`}
        >
          <div className={`w-full h-full rounded-full border-[6px] border-zinc-800 overflow-hidden ${isPlaying ? 'vinyl-spin' : ''}`}>
            <img src={vinylImg} alt="" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        {/* Album cover */}
        <div className="relative z-10 w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.02]">
          {song.art ? (
            <img
              src={song.art}
              alt={`${song.artist} - ${song.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-zinc-900 flex items-center justify-center">
              <svg className="w-16 h-16 text-white/10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        {/* Equalizer indicator */}
        {isPlaying && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-end gap-[3px] h-5">
            <span className="w-[3px] bg-purple-400 rounded-full eq-bar" style={{ animationDelay: '0ms' }} />
            <span className="w-[3px] bg-purple-400 rounded-full eq-bar" style={{ animationDelay: '200ms' }} />
            <span className="w-[3px] bg-purple-400 rounded-full eq-bar" style={{ animationDelay: '400ms' }} />
            <span className="w-[3px] bg-purple-400 rounded-full eq-bar" style={{ animationDelay: '150ms' }} />
            <span className="w-[3px] bg-purple-400 rounded-full eq-bar" style={{ animationDelay: '350ms' }} />
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="text-center mt-2 max-w-full px-2 space-y-1.5">
        <MarqueeTitle text={song.title} />
        <p className="text-white/40 text-sm">{song.artist}</p>
        {song.album && (
          <p className="text-white/20 text-xs">{song.album}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-purple-400 rounded-full transition-[width] duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/20 mt-2 font-mono tracking-wider">
          <span>{formatTime(interpolatedElapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeTitle({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      setShouldScroll(textRef.current.scrollWidth > containerRef.current.clientWidth);
    }
  }, [text]);

  if (!shouldScroll) {
    return (
      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
        {text}
      </h2>
    );
  }

  return (
    <div ref={containerRef} className="overflow-hidden max-w-[280px] md:max-w-[320px] mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight whitespace-nowrap marquee-text">
        <span ref={textRef}>{text}</span>
        <span className="mx-8 text-white/20">|</span>
        <span>{text}</span>
        <span className="mx-8 text-white/20">|</span>
      </h2>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
