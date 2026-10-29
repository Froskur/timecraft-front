import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { loadAccessToken } from '@/api/axios';
import { getCurrentUser } from '@/api/resources';
import { app } from '@/config';

const PREVIEW_FLAG = 'timecraft_shell_preview';

interface AuthContextValues {
  isAuthenticated: boolean;
  isInitialized: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  enterPreview: () => void;
}

export const AuthContext = createContext<AuthContextValues | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadAccessToken();

    if (sessionStorage.getItem(PREVIEW_FLAG) === '1') {
      setIsAuthenticated(true);
      setIsInitialized(true);
      return;
    }

    const token = localStorage.getItem(app.accessTokenStoreKey);
    const accountId = localStorage.getItem(app.accountIdStoreKey);
    if (!token || !accountId) {
      setIsAuthenticated(false);
      setIsInitialized(true);
      return;
    }

    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsInitialized(true));
  }, []);

  const enterPreview = () => {
    sessionStorage.setItem(PREVIEW_FLAG, '1');
    setIsAuthenticated(true);
  };

  const value = useMemo(
    () => ({ isAuthenticated, isInitialized, setIsAuthenticated, enterPreview }),
    [isAuthenticated, isInitialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
