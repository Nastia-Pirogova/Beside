import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Screen } from './types';

interface NavState {
  screen: Screen;
  activeOrderId: string | null;
  navigate: (screen: Screen) => void;
  setActiveOrderId: (id: string | null) => void;
}

const NavContext = createContext<NavState | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  return (
    <NavContext.Provider value={{ screen, activeOrderId, navigate, setActiveOrderId }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
