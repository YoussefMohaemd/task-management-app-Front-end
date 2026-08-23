import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  fetchProfile,
  getToken,
  loginUser,
  logoutUser,
  registerUser,
  setUnauthorizedHandler,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(() => Boolean(getToken()));
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      return undefined;
    }

    let isMounted = true;

    const restoreSession = async () => {
      try {
        const profile = await fetchProfile();
        if (isMounted) setUser(profile);
      } catch (error) {
        if (isMounted) {
          clearSession();
          setUser(null);
          if (error.status === 401) {
            setSessionExpired(true);
          }
        }
      } finally {
        if (isMounted) setInitializing(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setUser(null);
      setSessionExpired(true);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await loginUser(credentials);
    setUser(authenticatedUser);
    setSessionExpired(false);
    return authenticatedUser;
  }, []);

  const register = useCallback(async (payload) => {
    const createdUser = await registerUser(payload);
    setUser(createdUser);
    return createdUser;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setSessionExpired(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      sessionExpired,
      dismissSessionExpired: () => setSessionExpired(false),
      login,
      register,
      logout,
    }),
    [user, initializing, sessionExpired, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
