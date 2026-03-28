import { useEffect, useRef } from 'react';
import { useSchedule } from '../hooks/useSchedule';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function SchedulePopup({ isOpen, onClose }: Props) {
  const { schedule, isLoading, error, load } = useSchedule();
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="glass-card w-full max-w-sm mx-4 p-6 max-h-[80vh] overflow-y-auto fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white/80 text-xs font-medium tracking-[0.3em] uppercase">
            Programm
          </h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label="Close schedule"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-14 h-4 bg-white/5 rounded" />
                <div className="flex-1 h-4 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="text-center py-6">
            <p className="text-white/30 text-xs mb-3">Programm konnte nicht geladen werden</p>
            <button
              onClick={load}
              className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && schedule.length === 0 && (
          <p className="text-white/20 text-xs text-center py-6">
            Kein Programm verfügbar
          </p>
        )}

        {/* Schedule list */}
        {!isLoading && schedule.length > 0 && (
          <div className="space-y-1">
            {schedule.map((entry, i) => (
              <div
                key={entry.id ?? `${entry.start_timestamp}-${i}`}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  entry.is_now
                    ? 'bg-purple-500/10 ring-1 ring-purple-500/20'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="text-[10px] font-mono text-white/30 pt-0.5 flex-shrink-0 w-14">
                  {formatTime(entry.start)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70 font-medium truncate">
                      {entry.title || entry.name}
                    </span>
                    {entry.is_now && (
                      <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider flex-shrink-0">
                        Live
                      </span>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-[10px] text-white/20 mt-0.5 line-clamp-2">
                      {entry.description}
                    </p>
                  )}
                </div>
                <div className="text-[10px] font-mono text-white/20 pt-0.5 flex-shrink-0">
                  {formatTime(entry.end)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
