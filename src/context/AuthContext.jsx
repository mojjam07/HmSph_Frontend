import React, { createContext, useContext, useState, useEffect } from 'react';

// Error message constants for better user experience
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  ACCOUNT_LOCKED: 'Your account has been locked due to multiple failed login attempts. Please contact support.',
  ACCOUNT_DISABLED: 'Your account has been disabled. Please contact support for assistance.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  USER_NOT_FOUND: 'User account not found. Please check your email or register a new account.',
  PASSWORD_TOO_WEAK: 'Password is too weak. Please use a stronger password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please use a different email or try logging in.',
  INVALID_TOKEN: 'Invalid authentication token. Please log in again.',
  RATE_LIMIT_EXCEEDED: 'Too many login attempts. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Error code mapping for backend responses
const ERROR_CODE_MAPPING = {
  400: ERROR_MESSAGES.VALIDATION_ERROR,
  401: ERROR_MESSAGES.INVALID_CREDENTIALS,
  403: ERROR_MESSAGES.UNAUTHORIZED,
  404: ERROR_MESSAGES.USER_NOT_FOUND,
  409: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
  422: ERROR_MESSAGES.VALIDATION_ERROR,
  429: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
  500: ERROR_MESSAGES.SERVER_ERROR,
  503: ERROR_MESSAGES.SERVER_ERROR
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetchUserInfo();
    } else {
      setUser(null); // Clear user when no token
      setLoading(false);
    }
  }, [token]);

  const getErrorMessage = (response, fallbackMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
    if (!response) return fallbackMessage;
    
    // Check for specific error codes first
    if (response.status && ERROR_CODE_MAPPING[response.status]) {
      return ERROR_CODE_MAPPING[response.status];
    }
    
    // Check for custom error messages from backend
    if (response.data && response.data.error) {
      return response.data.error;
    }
    
    if (response.data && response.data.message) {
      return response.data.message;
    }
    
    if (response.error) {
      return response.error;
    }
    
    if (response.message) {
      return response.message;
    }
    
    return fallbackMessage;
  };

  const getNetworkErrorMessage = (error) => {
    if (!error) return ERROR_MESSAGES.NETWORK_ERROR;
    
    // Handle different types of network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (error.name === 'NetworkError') {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return 'Request timeout. Please check your connection and try again.';
    }
    
    if (error.message.includes('CORS')) {
      return 'Connection blocked by security settings. Please try again later.';
    }
    
    if (error.message.includes('offline') || error.message.includes('Offline')) {
      return 'You appear to be offline. Please check your internet connection.';
    }
    
    return error.message || ERROR_MESSAGES.NETWORK_ERROR;
  };

  const fetchUserInfo = async () => {
    try {
      // Use the correct API base URL
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setError(null);
      } else if (response.status === 401) {
        // Token is invalid or expired
        setError(ERROR_MESSAGES.TOKEN_EXPIRED);
        logout();
      } else if (response.status === 403) {
        setError(ERROR_MESSAGES.UNAUTHORIZED);
        logout();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = getErrorMessage({ status: response.status, data: errorData });
        setError(errorMessage);
        logout();
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      const errorMessage = getNetworkErrorMessage(error);
      setError(errorMessage);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Client-side validation
      if (!email || !password) {
        const errorMessage = 'Please enter both email and password.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (!email.includes('@')) {
        const errorMessage = 'Please enter a valid email address.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Use the correct API base URL
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      
      if (response.status === 204 || response.statusText === 'No Content') {
        data = { error: ERROR_MESSAGES.SERVER_ERROR };
      } else if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          data = { error: ERROR_MESSAGES.SERVER_ERROR };
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        data = { error: response.status >= 400 ? ERROR_MESSAGES.SERVER_ERROR : ERROR_MESSAGES.UNKNOWN_ERROR };
      }

      if (response.ok) {
        if (data.token && data.user) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          return { success: true, user: data.user };
        } else {
          const errorMessage = data.error || ERROR_MESSAGES.SERVER_ERROR;
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } else {
        // Handle specific HTTP status codes and backend errors
        let errorMessage = getErrorMessage({ status: response.status, data });
        
        // Override with more specific messages based on backend response
        if (data.error) {
          if (data.error.includes('invalid credentials')) {
            errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
          } else if (data.error.includes('account locked')) {
            errorMessage = ERROR_MESSAGES.ACCOUNT_LOCKED;
          } else if (data.error.includes('account disabled')) {
            errorMessage = ERROR_MESSAGES.ACCOUNT_DISABLED;
          } else if (data.error.includes('email not verified')) {
            errorMessage = ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
          } else if (data.error.includes('user not found')) {
            errorMessage = ERROR_MESSAGES.USER_NOT_FOUND;
          } else {
            // If a generic error message is received from the backend, and we are in development mode,
            // include the backend's message to assist with debugging. Otherwise, display a generic
            // server error message.
            errorMessage = data.error;
          }
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = getNetworkErrorMessage(error);
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
      
      // Client-side validation
      if (!userData.email || !userData.password) {
        const errorMessage = 'Please fill in all required fields.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      if (!userData.email.includes('@')) {
        const errorMessage = 'Please enter a valid email address.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      if (userData.password.length < 6) {
        const errorMessage = ERROR_MESSAGES.PASSWORD_TOO_WEAK;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      // Use the correct API base URL
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      
      if (response.status === 204 || response.statusText === 'No Content') {
        data = { error: ERROR_MESSAGES.SERVER_ERROR };
      } else if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          data = { error: ERROR_MESSAGES.SERVER_ERROR };
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        data = { error: response.status >= 400 ? ERROR_MESSAGES.SERVER_ERROR : ERROR_MESSAGES.UNKNOWN_ERROR };
      }

      if (response.ok) {
        if (data.token && data.user) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          return { success: true, user: data.user };
        } else {
          const errorMessage = data.error || ERROR_MESSAGES.SERVER_ERROR;
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } else {
        let errorMessage = getErrorMessage({ status: response.status, data });
        
        // Handle specific registration errors
        if (data.error) {
          if (data.error.includes('email already exists')) {
            errorMessage = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
          } else if (data.error.includes('password')) {
            errorMessage = ERROR_MESSAGES.PASSWORD_TOO_WEAK;
          } else {
            errorMessage = data.error;
          }
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = getNetworkErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

