import React from 'react';
import { useMode } from '../context/ModeContext';
import { useActiveTradingContext } from '../context/useActiveTradingContext';

export const ModeSwitcher: React.FC = () => {
  const { mode, setMode } = useMode();
  const { isConnected } = useActiveTradingContext();

  return (
    <div style={{ display: 'flex', gap: 8, margin: 8 }}>
      <button
        onClick={() => setMode('demo')}
        disabled={mode === 'demo'}
        style={{ background: mode === 'demo' ? '#4ade80' : '#e5e7eb', padding: 8, borderRadius: 4 }}
      >
        Modo Demo {mode === 'demo' && isConnected ? '🟢' : '🔴'}
      </button>
      <button
        onClick={() => setMode('real')}
        disabled={mode === 'real'}
        style={{ background: mode === 'real' ? '#60a5fa' : '#e5e7eb', padding: 8, borderRadius: 4 }}
      >
        Modo Real {mode === 'real' && isConnected ? '🟢' : '🔴'}
      </button>
    </div>
  );
};
