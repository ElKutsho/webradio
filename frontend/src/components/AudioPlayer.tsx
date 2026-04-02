import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { SchedulePopup } from './SchedulePopup';
import { DeviceSelector } from './DeviceSelector';

export function AudioPlayer() {
  const {
    isPlaying, isBuffering, volume, toggle, setVolume, nowPlaying,
    browserDevices, selectedDeviceId, sonosZones, sonosAvailable, sonosDiscovering,
    activeSonosZone, selectBrowserDevice, selectSonosZone, refreshSonos,
  } = usePlayer();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);

  if (!nowPlaying) return null;

  return (
    <>
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

          {/* Device selector button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setDeviceOpen(!deviceOpen)}
              className={`transition-colors ${
                activeSonosZone
                  ? 'text-[var(--accent,#8b5cf6)]'
                  : 'text-white/30 hover:text-white/60'
              }`}
              aria-label="Ausgabegerät wählen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.75.75 0 0 1-1.006-.327 11.002 11.002 0 0 1-.968-3.326m.968-6.042a10.93 10.93 0 0 1-.968-3.325.75.75 0 0 1 1.006-.327l.657.38c.523.301.71.96.463 1.51-.4.892-.732 1.822-.985 2.784Zm5.384-4.523A9 9 0 0 1 17.25 12a9 9 0 0 1-1.526 4.523M20.515 6.343a12 12 0 0 1 0 11.314" />
              </svg>
              {activeSonosZone && (
                <div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent, #8b5cf6)' }}
                />
              )}
            </button>
            <DeviceSelector
              isOpen={deviceOpen}
              onClose={() => setDeviceOpen(false)}
              browserDevices={browserDevices}
              sonosZones={sonosZones}
              sonosAvailable={sonosAvailable}
              sonosDiscovering={sonosDiscovering}
              selectedDeviceId={selectedDeviceId}
              activeSonosZone={activeSonosZone}
              onSelectBrowserDevice={(id) => {
                selectBrowserDevice(id);
                setDeviceOpen(false);
              }}
              onSelectSonos={(name) => {
                selectSonosZone(name);
                setDeviceOpen(false);
              }}
              onRefreshSonos={refreshSonos}
            />
          </div>

          {/* Schedule button */}
          <button
            onClick={() => setScheduleOpen(true)}
            className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
            aria-label="Show schedule"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={toggle}
            className="relative w-12 h-12 flex items-center justify-center rounded-full active:scale-95 transition-all flex-shrink-0 shadow-lg"
            style={{
              background: `linear-gradient(135deg, var(--accent, #8b5cf6), var(--accent-dark, #7c3aed))`,
              boxShadow: `0 10px 15px -3px color-mix(in srgb, var(--accent, #8b5cf6) 20%, transparent)`,
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {/* Glow ring */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{ animationDuration: '2s', backgroundColor: `color-mix(in srgb, var(--accent, #8b5cf6) 20%, transparent)` }} />
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
              style={{
                background: `linear-gradient(to right, var(--accent, #a78bfa) 0%, var(--accent, #a78bfa) ${volume * 100}%, rgba(255, 255, 255, 0.08) ${volume * 100}%, rgba(255, 255, 255, 0.08) 100%)`,
              }}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.25 8.25 4.51 8.25H6.75Z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <SchedulePopup isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </>
  );
}
