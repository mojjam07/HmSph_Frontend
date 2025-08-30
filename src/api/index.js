// Main API export file
// This file serves as the central export point for all API services

export { API_BASE_URL, getHeaders } from './config.js';
export { handleResponse, apiRequest } from './utils.js';
export { default as propertiesAPI } from './properties.js';
export { default as authAPI } from './auth.js';
export { default as favoritesAPI } from './favorites.js';
export { default as listingsAPI } from './listings.js';

// Legacy support - export the PropertiesAPI class for backward compatibility
export class PropertiesAPI {
  static async request(endpoint, options = {}) {
    const { apiRequest } = await import('./utils.js');
    return apiRequest(endpoint, options);
  }

  static async getProperties(filters = {}) {
    const { default: propertiesAPI } = await import('./properties.js');
    return propertiesAPI.getProperties(filters);
  }

  static async searchProperties(query, filters = {}) {
    const { default: propertiesAPI } = await import('./properties.js');
    return propertiesAPI.searchProperties(query, filters);
  }

  static async getProperty(id) {
    const { default: propertiesAPI } = await import('./properties.js');
    return propertiesAPI.getProperty(id);
  }

  static async getFavorites() {
    const { default: favoritesAPI } = await import('./favorites.js');
    return favoritesAPI.getFavorites();
  }

  static async addToFavorites(propertyId) {
    const { default: favoritesAPI } = await import('./favorites.js');
    return favoritesAPI.addToFavorites(propertyId);
  }

  static async removeFromFavorites(propertyId) {
    const { default: favoritesAPI } = await import('./favorites.js');
    return favoritesAPI.removeFromFavorites(propertyId);
  }
}

// Legacy ApiService for backward compatibility
export class ApiService {
  static async request(endpoint, options = {}) {
    const { apiRequest } = await import('./utils.js');
    return apiRequest(endpoint, options);
  }

  static async getProperties(filters = {}) {
    const { default: propertiesAPI } = await import('./properties.js');
    return propertiesAPI.getProperties(filters);
  }

  static async getProperty(id) {
    const { default: propertiesAPI } = await import('./properties.js');
    return propertiesAPI.getProperty(id);
  }

  static async addToFavorites(propertyId) {
    const { default: favoritesAPI } = await import('./favorites.js');
    return favoritesAPI.addToFavorites(propertyId);
  }

  static async removeFromFavorites(propertyId) {
    const { default: favoritesAPI } = await import('./favorites.js');
    return favoritesAPI.removeFromFavorites(propertyId);
  }

  static async getFavorites() {
    const { default: favoritesAPI } = await import('./favorites.js');
    return favoritesAPI.getFavorites();
  }

  static async searchProperties(query) {
    const { default: propertiesAPI } = await import('./properties.js');
    return propertiesAPI.searchProperties(query);
  }
}

// Legacy individual exports for backward compatibility
export { register, login, getProfile, getListings } from './legacy.js';
