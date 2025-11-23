import { useContext } from 'react';
import { ThemeStateContext } from '../theme-state-context';

export const useThemeState = () => {
  const context = useContext(ThemeStateContext);
  if (!context) {
    throw new Error('useThemeState must be used within ThemeContextProvider');
  }
  return context;
};
