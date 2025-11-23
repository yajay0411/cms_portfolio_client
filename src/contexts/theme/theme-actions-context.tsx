import { createContext } from 'react';

export type ThemeActions = {
  toggleTheme: () => void;
};

export const ThemeActionsContext = createContext<ThemeActions | undefined>(undefined);
