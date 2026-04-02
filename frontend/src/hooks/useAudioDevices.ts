import { useState, useEffect, useCallback } from 'react';

export interface AudioOutputDevice {
  id: string;
  label: string;
  type: 'browser';
}

const DEVICE_KEY = 'kutsho-radio-device';

export function useAudioDevices() {
  const [devices, setDevices] = useState<AudioOutputDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => {
    return localStorage.getItem(DEVICE_KEY) || 'default';
  });

  const enumerate = useCallback(async () => {
    try {
      // Need permission first - some browsers require getUserMedia before enumerateDevices
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          // Permission denied or not available - still try to enumerate
        }
      }

      if (!navigator.mediaDevices?.enumerateDevices) return;

      const all = await navigator.mediaDevices.enumerateDevices();
      const outputs = all
        .filter((d) => d.kind === 'audiooutput')
        .map((d) => ({
          id: d.deviceId,
          label: d.label || (d.deviceId === 'default' ? 'Standard-Ausgabe' : `Gerät ${d.deviceId.slice(0, 6)}`),
          type: 'browser' as const,
        }));

      setDevices(outputs);
    } catch {
      // enumerateDevices not supported
    }
  }, []);

  useEffect(() => {
    enumerate();

    navigator.mediaDevices?.addEventListener('devicechange', enumerate);
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', enumerate);
    };
  }, [enumerate]);

  const selectDevice = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId);
    localStorage.setItem(DEVICE_KEY, deviceId);
  }, []);

  return { devices, selectedDeviceId, selectDevice, refresh: enumerate };
}
