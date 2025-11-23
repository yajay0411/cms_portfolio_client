import { createContext } from 'react';

export type ThemeState = {
  themeMode: 'light' | 'dark';
};

export const ThemeStateContext = createContext<ThemeState | undefined>(undefined);
