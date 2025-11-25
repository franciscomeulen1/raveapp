import React, { useMemo } from 'react';

// Muestra una barra y el texto "Reserva expira en mm:ss"
export default function CountdownBar({ remainingSec }) {
  const mmss = useMemo(() => {
    const m = Math.floor(Math.max(remainingSec, 0) / 60);
    const s = Math.max(remainingSec, 0) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remainingSec]);

  const percent = useMemo(() => {
    // 600s total. Ajusta si cambias la duración
    return Math.max(0, Math.min(100, (remainingSec / 600) * 100));
  }, [remainingSec]);

  return (
    <div className="mx-6 sm:px-10 my-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Tu reserva expira en</span>
        <span className="text-sm font-mono">{mmss}</span>
      </div>
      <progress className="progress progress-secondary w-full" value={percent} max="100" />
    </div>
  );
}
