// Import the new response handler
import { ResponseHandler } from './responseHandler.js';

// Enhanced response handler to prevent JSON parsing errors
export async function handleResponse(response) {
  return ResponseHandler.handleApiResponse(response);
}

// Enhanced base request function for all API calls
export async function apiRequest(endpoint, options = {}) {
  const { API_BASE_URL } = await import('./config.js');
  const { getHeaders } = await import('./config.js');
  
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await ResponseHandler.handleApiResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    
    // Provide more user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else if (error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else if (error.message.includes('JSON_PARSE_ERROR')) {
      throw new Error('Server returned an invalid response format. Please try again.');
    } else {
      throw error;
    }
  }
}
