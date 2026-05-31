import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check local storage on initial mount
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  // Listen for the custom 'nexus_auth_expired' event dispatched by our Axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setError('Your session expired. Please log in again.');
    };
    window.addEventListener('nexus_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('nexus_auth_expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { email, password };
      console.log('Sending Login Payload:', payload);
      
      const { data } = await api.post('/auth/login', payload);
      setUser(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', userData);
      setUser(data); // Auto-login after register
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
