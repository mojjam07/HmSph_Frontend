// Authentication API service
import { apiRequest } from './utils.js';

export const authAPI = {
  // User registration
  async register(userData) {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // User login
  async login(credentials) {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    try {
      return await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (error) {
      // Enhance error messages for better user experience
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      } else {
        throw error; // Re-throw the original error
      }
    }
  },

  // Get user profile
  async getProfile(token) {
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    try {
      const response = await apiRequest('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid profile response format');
      }
      
      return response;
    } catch (error) {
      // Enhance error with context
      console.error('Auth API getProfile error:', error);
      throw new Error(`Profile fetch failed: ${error.message}`);
    }
  }
};

export default authAPI;
