import React, { createContext, useContext, useState } from 'react';

export type TradingMode = 'demo' | 'real';

interface ModeContextType {
  mode: TradingMode;
  setMode: (mode: TradingMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within a ModeProvider');
  return ctx;
};

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<TradingMode>('demo');
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
