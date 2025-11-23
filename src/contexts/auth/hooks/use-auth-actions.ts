import { useContext } from 'react';
import { AuthActionsContext } from '../auth-actions-context';

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within AuthContextProvider');
  }
  return context;
};
