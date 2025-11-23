'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthState, AuthStateContext, IUser } from './auth-state-context';

import { AuthActions, AuthActionsContext } from './auth-actions-context';
import { EStorageKey } from '@constants/storage_key';
import { clearAllStorage, setInLS } from '@utils/browserStorage';
import PATH from '@constants/path';
import useNavigation from '@hooks/useNavigation';

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { goTo } = useNavigation();

  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(EStorageKey.USER_KEY);
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored) as IUser;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        clearAllStorage();
      }
    }
  }, []);

  // ------------------------
  // ACTION IMPLEMENTATIONS
  // ------------------------
  const setUserData = (user: IUser | null) => {
    setUser(user);
    if (user) setInLS(EStorageKey.USER_KEY, user);
    else localStorage.removeItem(EStorageKey.USER_KEY);
  };

  const login = async (payload: { user: IUser }) => {
    setUser(payload.user);
    setIsAuthenticated(true);
    setInLS(EStorageKey.USER_KEY, payload.user);
    goTo(PATH.dashboard);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAllStorage();
    goTo(PATH.login);
  };

  const actions: AuthActions = {
    setUserData,
    setIsAuthenticated,
    login,
    logout
  };

  const state: AuthState = {
    user,
    isAuthenticated
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>{children}</AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};
