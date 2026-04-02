import { useEffect, useRef } from 'react';
import type { AudioOutputDevice } from '../hooks/useAudioDevices';
import type { SonosZone } from '../hooks/useSonos';

interface DeviceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  browserDevices: AudioOutputDevice[];
  sonosZones: SonosZone[];
  sonosAvailable: boolean;
  sonosDiscovering: boolean;
  selectedDeviceId: string;
  activeSonosZone: string | null;
  onSelectBrowserDevice: (id: string) => void;
  onSelectSonos: (zoneName: string) => void;
  onRefreshSonos: () => void;
}

function getDeviceIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('headphone') || l.includes('kopfhörer') || l.includes('airpod') || l.includes('headset')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a8 8 0 0 0-8 8v4a4 4 0 0 0 4 4h0a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-1v-1a5 5 0 1 1 10 0v1h-1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h0a4 4 0 0 0 4-4v-4a8 8 0 0 0-8-8Z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-3.72a.75.75 0 0 1 1.28.53v14.88a.75.75 0 0 1-1.28.53l-4.72-3.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  );
}

export function DeviceSelector({
  isOpen,
  onClose,
  browserDevices,
  sonosZones,
  sonosAvailable,
  sonosDiscovering,
  selectedDeviceId,
  activeSonosZone,
  onSelectBrowserDevice,
  onSelectSonos,
  onRefreshSonos,
}: DeviceSelectorProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid closing immediately from the click that opened it
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDevice = activeSonosZone
    ? `Sonos · ${activeSonosZone}`
    : browserDevices.find((d) => d.id === selectedDeviceId)?.label || 'Dieses Gerät';

  return (
    <div
      ref={panelRef}
      className="absolute bottom-full left-0 mb-2 w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
      style={{ animation: 'fade-in-up 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Aktuelle Wiedergabe</div>
        <div className="text-sm text-white/80 mt-1 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--accent, #8b5cf6)' }}
          />
          {currentDevice}
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mx-3" />

      {/* Browser Devices */}
      <div className="px-2 py-2">
        <div className="px-2 py-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
          Dieses Gerät
        </div>
        {browserDevices.length === 0 ? (
          <div className="px-2 py-2 text-xs text-white/20">Keine Ausgabegeräte gefunden</div>
        ) : (
          browserDevices.map((device) => {
            const isActive = !activeSonosZone && device.id === selectedDeviceId;
            return (
              <button
                key={device.id}
                onClick={() => onSelectBrowserDevice(device.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-white/[0.08]'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className={isActive ? 'text-[var(--accent,#8b5cf6)]' : 'text-white/30'}>
                  {getDeviceIcon(device.label)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm truncate ${
                      isActive ? 'font-medium' : ''
                    }`}
                    style={isActive ? { color: 'var(--accent, #8b5cf6)' } : { color: 'rgba(255,255,255,0.7)' }}
                  >
                    {device.label}
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full eq-bar"
                        style={{
                          backgroundColor: 'var(--accent, #8b5cf6)',
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Sonos Section */}
      <div className="h-px bg-white/[0.06] mx-3" />
      <div className="px-2 py-2">
        <div className="px-2 py-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            Sonos
          </span>
          <button
            onClick={onRefreshSonos}
            className="text-white/20 hover:text-white/50 transition-colors"
            aria-label="Sonos suchen"
            disabled={sonosDiscovering}
          >
            <svg
              className={`w-3.5 h-3.5 ${sonosDiscovering ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          </button>
        </div>

        {!sonosAvailable && !sonosDiscovering && (
          <div className="px-3 py-3 text-xs text-white/20 text-center">
            <div className="mb-1">Keine Sonos-Lautsprecher gefunden</div>
            <div className="text-[10px] text-white/10">
              Starte node-sonos-http-api auf Port 5005
            </div>
          </div>
        )}

        {sonosDiscovering && sonosZones.length === 0 && (
          <div className="px-3 py-3 flex items-center justify-center gap-2 text-xs text-white/30">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Suche Sonos...
          </div>
        )}

        {sonosZones.map((zone) => {
          const isActive = activeSonosZone === zone.name;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectSonos(zone.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                isActive ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
              }`}
            >
              <div className={isActive ? 'text-[var(--accent,#8b5cf6)]' : 'text-white/30'}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm truncate ${isActive ? 'font-medium' : ''}`}
                  style={isActive ? { color: 'var(--accent, #8b5cf6)' } : { color: 'rgba(255,255,255,0.7)' }}
                >
                  {zone.name}
                </div>
                {zone.members.length > 1 && (
                  <div className="text-[10px] text-white/20 truncate">
                    {zone.members.join(' + ')}
                  </div>
                )}
              </div>
              {isActive && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full eq-bar"
                      style={{
                        backgroundColor: 'var(--accent, #8b5cf6)',
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
