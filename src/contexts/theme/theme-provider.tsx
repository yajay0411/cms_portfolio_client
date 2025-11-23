import { useState, useEffect, useMemo, ReactNode } from 'react';

import { ThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ThemeStateContext } from './theme-state-context';
import { ThemeActionsContext } from './theme-actions-context';
import { getTheme } from '../../theme';
import { getFromLS, setInLS } from '@utils/browserStorage';
import useIsMobile from '@hooks/useIsMobile';

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  // On init get from localStorage if not the default to dark
  useEffect(() => {
    const stored = getFromLS('themeMode');
    if (stored) {
      setThemeMode(stored as 'light' | 'dark');
    } else {
      setThemeMode('dark');
    }
  }, []);

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // On toggle update the local storage
  useEffect(() => {
    setInLS('themeMode', themeMode);
  }, [themeMode]);

  // Actions
  const toggleTheme = () => {
    setThemeMode((cur) => (cur === 'light' ? 'dark' : 'light'));
  };

  // Memoized responsive theme
  const theme: Theme = useMemo(() => getTheme(themeMode === 'dark', isMobile), [themeMode, isMobile]);

  return (
    <ThemeStateContext.Provider value={{ themeMode }}>
      <ThemeActionsContext.Provider value={{ toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
};
