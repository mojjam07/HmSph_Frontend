// Legacy exports for backward compatibility
// This file provides backward compatibility for the old api.js structure

import { apiRequest } from './utils.js';

// Legacy individual functions
export async function register(userData) {
  const { authAPI } = await import('./auth.js');
  return authAPI.register(userData);
}

export async function login(credentials) {
  const { authAPI } = await import('./auth.js');
  return authAPI.login(credentials);
}

export async function getProfile(token) {
  const { authAPI } = await import('./auth.js');
  return authAPI.getProfile(token);
}

export async function getListings() {
  const { listingsAPI } = await import('./listings.js');
  return listingsAPI.getListings();
}
