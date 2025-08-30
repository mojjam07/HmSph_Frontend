// Properties API service
import { apiRequest } from './utils.js';

export const propertiesAPI = {
  // Get all properties with filters
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters as query parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all' && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const endpoint = queryParams.toString() 
      ? `/api/properties?${queryParams.toString()}`
      : '/api/properties';
      
    return apiRequest(endpoint);
  },

  // Search properties
  async searchProperties(query, filters = {}) {
    const queryParams = new URLSearchParams({
      q: query,
      ...filters
    });

    return apiRequest(`/api/properties/search?${queryParams.toString()}`);
  },

  // Get single property
  async getProperty(id) {
    return apiRequest(`/api/properties/${id}`);
  }
};

export default propertiesAPI;
