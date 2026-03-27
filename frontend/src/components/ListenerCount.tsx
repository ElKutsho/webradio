import { usePlayer } from '../context/PlayerContext';

export function ListenerCount() {
  const { nowPlaying } = usePlayer();

  if (!nowPlaying) return null;

  const count = nowPlaying.listeners.current;

  return (
    <div className="flex items-center gap-1.5 text-white/40 text-sm">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
      <span>{count} {count === 1 ? 'Listener' : 'Listeners'}</span>
    </div>
  );
}
