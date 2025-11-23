import { createContext } from 'react';

export type IUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
};

export type AuthState = {
  user: IUser | null;
  isAuthenticated: boolean;
};

export const AuthStateContext = createContext<AuthState | undefined>(undefined);
