import { useContext } from 'react';
import { ThemeActionsContext } from '../theme-actions-context';

export const useThemeActions = () => {
  const context = useContext(ThemeActionsContext);
  if (!context) {
    throw new Error('useThemeActions must be used within ThemeContextProvider');
  }
  return context;
};
