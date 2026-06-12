import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [theme,    setTheme]    = useState('light');
  const isAuth = !!useAuthStore((s) => s.token);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <AppContext.Provider value={{ isMobile, theme, setTheme, isAuth }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
