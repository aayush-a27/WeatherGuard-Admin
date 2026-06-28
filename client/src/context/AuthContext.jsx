import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMe } from '../services/authService';
import { STORAGE_KEYS } from '../constants';
import { extractTokenFromUrl } from '../utils/helpers';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user && !!token;

  // Fetch user profile from backend
  const fetchUser = useCallback(async (authToken) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      setToken(authToken);
      const userData = await getMe();
      setUser(userData);
      return userData;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  // Login — store token and fetch user
  const login = useCallback(async (authToken) => {
    setLoading(true);
    const userData = await fetchUser(authToken);
    setLoading(false);
    if (userData) {
      navigate('/dashboard', { replace: true });
    }
  }, [fetchUser, navigate]);

  // Logout — clear state and redirect
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  // Update user in context (after profile changes like Telegram connection)
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  // On mount: check for token in URL (OAuth redirect) or localStorage
  useEffect(() => {
    const init = async () => {
      // Check URL for token (OAuth callback redirect)
      const urlToken = extractTokenFromUrl();
      if (urlToken) {
        // Clean URL
        window.history.replaceState({}, document.title, location.pathname);
        await login(urlToken);
        return;
      }

      // Check localStorage for existing token
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (storedToken) {
        await fetchUser(storedToken);
      }

      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
