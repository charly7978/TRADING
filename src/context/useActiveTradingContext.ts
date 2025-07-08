import { useMode } from '../context/ModeContext';
import { useTradingContext } from '../context/TradingContext';
import { useRealTradingContext } from '../context/RealTradingContext';

export function useActiveTradingContext() {
  const { mode } = useMode();
  if (mode === 'real') {
    return useRealTradingContext();
  }
  return useTradingContext();
}
