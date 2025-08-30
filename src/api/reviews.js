// Reviews API service
import { apiRequest } from './utils.js';

export const reviewsAPI = {
  // Get all reviews
  async getReviews() {
    try {
      const response = await apiRequest('/api/reviews');
      // Ensure we always return an array
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.reviews && Array.isArray(response.reviews)) {
        return response.reviews;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected response format from reviews API:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get reviews for a specific property
  async getPropertyReviews(propertyId) {
    try {
      const response = await apiRequest(`/api/reviews/property/${propertyId}`);
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.reviews && Array.isArray(response.reviews)) {
        return response.reviews;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching reviews for property ${propertyId}:`, error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get reviews for a specific agent
  async getAgentReviews(agentId) {
    try {
      const response = await apiRequest(`/api/reviews/agent/${agentId}`);
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.reviews && Array.isArray(response.reviews)) {
        return response.reviews;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching reviews for agent ${agentId}:`, error);
      return []; // Return empty array instead of throwing
    }
  },

  // Create a new review
  async createReview(reviewData) {
    try {
      const response = await apiRequest('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error(error.message || 'Failed to create review');
    }
  },

  // Like a review
  async likeReview(reviewId) {
    try {
      const response = await apiRequest(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.error(`Error liking review ${reviewId}:`, error);
      throw new Error(error.message || 'Failed to like review');
    }
  },

  // Dislike a review
  async dislikeReview(reviewId) {
    try {
      const response = await apiRequest(`/api/reviews/${reviewId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.error(`Error disliking review ${reviewId}:`, error);
      throw new Error(error.message || 'Failed to dislike review');
    }
  },

  // Get reviews by user
  async getUserReviews(userId) {
    try {
      const response = await apiRequest(`/api/reviews/user/${userId}`);
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.reviews && Array.isArray(response.reviews)) {
        return response.reviews;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get review statistics
  async getReviewStats() {
    try {
      const response = await apiRequest('/api/reviews/stats');
      return response;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw new Error(error.message || 'Failed to fetch review statistics');
    }
  }
};

export default reviewsAPI;
