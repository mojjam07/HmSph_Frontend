// Listings API service
import { apiRequest } from './utils.js';

export const listingsAPI = {
  // Get all listings
  async getListings() {
    return apiRequest('/api/listings');
  }
};

export default listingsAPI;
