// Agents API service
import { apiRequest } from './utils.js';

export const agentsAPI = {
  // Get list of agents with optional filters
  async getAgents(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/api/agents${query ? `?${query}` : ''}`);
  },

  // Approve an agent
  async approveAgent(agentId) {
    return apiRequest(`/api/admin/agents/${agentId}/approve`, {
      method: 'POST'
    });
  },

  // Reject an agent
  async rejectAgent(agentId) {
    return apiRequest(`/api/admin/agents/${agentId}/reject`, {
      method: 'POST'
    });
  },

  // Contact an agent
  async contactAgent(agentId, contactData) {
    return apiRequest(`/api/agents/${agentId}/contact`, {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export default agentsAPI;
