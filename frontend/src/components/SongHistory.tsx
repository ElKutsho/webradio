import { usePlayer } from '../context/PlayerContext';

export function SongHistory() {
  const { nowPlaying } = usePlayer();

  if (!nowPlaying?.song_history?.length) return null;

  const history = nowPlaying.song_history.slice(0, 5);

  return (
    <div className="w-full mt-4 fade-in-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-white/20 text-[10px] font-medium uppercase tracking-[0.3em] mb-3 text-center">
        Previously Played
      </h3>
      <div className="space-y-1">
        {history.map((entry, i) => (
          <div
            key={entry.sh_id}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors group"
            style={{ opacity: 1 - i * 0.12 }}
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden ring-1 ring-white/[0.04]">
              {entry.song.art ? (
                <img
                  src={entry.song.art}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white/10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/50 font-medium truncate group-hover:text-white/70 transition-colors">
                {entry.song.title}
              </div>
              <div className="text-[10px] text-white/20 truncate">
                {entry.song.artist}
              </div>
            </div>
            <div className="text-[10px] text-white/10 font-mono flex-shrink-0">
              {formatDuration(entry.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
