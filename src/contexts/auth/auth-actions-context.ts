import { createContext } from 'react';
import { IUser } from './auth-state-context';

export type AuthActions = {
  setUserData: (user: IUser | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  login: (payload: { user: IUser }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthActionsContext = createContext<AuthActions | undefined>(undefined);
