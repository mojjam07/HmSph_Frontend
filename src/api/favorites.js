// Favorites API service
import { apiRequest } from './utils.js';
import { getHeaders } from './config.js';

export const favoritesAPI = {
  // Get user's favorite properties
  async getFavorites() {
    return apiRequest('/favorites', {
      headers: getHeaders()
    });
  },

  // Add property to favorites
  async addToFavorites(propertyId) {
    return apiRequest('/favorites', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ propertyId }),
    });
  },

  // Remove property from favorites
  async removeFromFavorites(propertyId) {
    return apiRequest(`/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  }
};

export default favoritesAPI;
