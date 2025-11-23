import { useContext } from 'react';
import { AuthStateContext } from '../auth-state-context';

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within AuthContextProvider');
  }
  return context;
};
