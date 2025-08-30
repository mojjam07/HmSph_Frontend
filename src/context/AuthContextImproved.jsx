import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create axios instance with interceptors
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        await fetchUserInfo();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [accessToken]);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      console.error('Error fetching user info:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post('/auth/login', credentials);
      const { tokens, user } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post('/auth/register', userData);
      const { tokens, user } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setError(null);
    }
  }, []);

  const refreshAccessToken = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const response = await api.post('/auth/refresh-token', {
        refreshToken,
      });

      const { accessToken: newAccessToken } = response.data;
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateUser = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  const getErrorMessage = (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection.';
    }
    
    if (error.message?.includes('Network')) {
      return 'Network error. Please check your connection.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUser,
    loading,
    error,
    clearError,
    isAuthenticated: !!user,
    isRefreshing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for protected routes
export const useProtectedRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  return {
    isAuthorized: isAuthenticated,
    isLoading: loading,
    user,
  };
};

// Custom hook for role-based access
export const useRoleAccess = (allowedRoles = []) => {
  const { user, loading } = useAuth();
  
  const hasAccess = user && (allowedRoles.length === 0 || allowedRoles.includes(user.role));
  
  return {
    hasAccess,
    userRole: user?.role,
    isLoading: loading,
  };
};
