import React from 'react';
import { useMode } from '../context/ModeContext';
import { useTradingContext } from '../context/TradingContext';
import { useRealTradingContext } from '../context/RealTradingContext';

export const ModeSwitcher: React.FC = () => {
  const { mode, setMode } = useMode();
  const { isConnected: isDemoConnected } = useTradingContext();
  const { isConnected: isRealConnected } = useRealTradingContext();

  return (
    <div style={{ display: 'flex', gap: 8, margin: 8 }}>
      <button
        onClick={() => setMode('demo')}
        disabled={mode === 'demo'}
        style={{ background: mode === 'demo' ? '#4ade80' : '#e5e7eb', padding: 8, borderRadius: 4 }}
      >
        Modo Demo {isDemoConnected ? '🟢' : '🔴'}
      </button>
      <button
        onClick={() => setMode('real')}
        disabled={mode === 'real'}
        style={{ background: mode === 'real' ? '#60a5fa' : '#e5e7eb', padding: 8, borderRadius: 4 }}
      >
        Modo Real {isRealConnected ? '🟢' : '🔴'}
      </button>
    </div>
  );
};
