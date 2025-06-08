import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { User } from '../types/user.type';
import {
  getFromLS,
  setInLS,
  getFromCS,
  clearAllStorage,
} from '../utils/browserStorage';
import { EStorageKey } from '../constants/storage_key';
import AuthApiService from '../services/api/auth.api.service';

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  initializeAuth: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextInterface>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  initializeAuth: async () => {},
  loading: true,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate token and fetch user data
  const validateAuth = useCallback(async () => {
    const token = getFromCS(EStorageKey.CLIENT_ACCESS_TOKEN);
    if (!token) {
      logout();
      return;
    }
    try {
      // Verify token with backend
      const { success, data, message } =
        await AuthApiService.selfIdentification();
      if (!success) {
        throw new Error(message);
      }
      const userData = data || getFromLS(EStorageKey.USER_KEY);
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      // Token is invalid, clear auth state
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    await validateAuth();
  }, [validateAuth]);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    clearAllStorage();
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Sync user data to storage when it changes
  useEffect(() => {
    if (user && isAuthenticated) {
      setInLS(EStorageKey.USER_KEY, user);
    }
  }, [user, isAuthenticated]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        initializeAuth,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
