 // Agents API service
import { apiRequest } from './utils.js';

export const agentsAPI = {
  // Get list of agents with optional filters
  async getAgents(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/api/agents${query ? `?${query}` : ''}`);
  }
};

export default agentsAPI;
