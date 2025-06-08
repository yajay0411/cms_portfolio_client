import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { getTheme } from '../theme';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  toggleTheme: () => void;
  themeMode: 'light' | 'dark';
  isMobile: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Effect to detect and update mobile state
  useEffect(() => {
    // Set initial mobile state
    setIsMobile(window.innerWidth < 600);

    // Handle resize events
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Use the getTheme function to create a responsive theme
  const theme: Theme = useMemo(
    () => getTheme(themeMode === 'dark', isMobile),
    [themeMode, isMobile]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeMode, isMobile }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};