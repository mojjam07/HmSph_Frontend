const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      console.log('ApiService: Adding Authorization header with token:', token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('ApiService: No token found in localStorage');
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Handle direct response formats
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Properties API - Updated endpoints
  static async getProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/api/properties${queryString ? `?${queryString}` : ''}`);
    return response.properties || response; // Handle both formats
  }

  static async getProperty(id) {
    const response = await this.request(`/api/properties/${id}`);
    return response.property || response; // Handle both formats
  }

  static async createProperty(propertyData) {
    // Transform propertyData to match backend expectations
    const transformedData = {
      ...propertyData,
      city: propertyData.city || propertyData.area || '',
      squareFootage: Number(propertyData.squareFootage || propertyData.size || 0),
      zipCode: propertyData.zipCode || '',
      price: Number(propertyData.price) || 0,
      bedrooms: Number(propertyData.bedrooms) || 0,
      bathrooms: Number(propertyData.bathrooms) || 0,
      propertyType: propertyData.propertyType ? propertyData.propertyType.toUpperCase() : 'HOUSE',
      status: propertyData.status ? propertyData.status.toUpperCase() : 'PENDING'
    };

    const response = await this.request('/api/properties', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
    return response.property || response; // Handle both formats
  }

  static async updateProperty(id, propertyData) {
    const response = await this.request(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
    return response.property || response; // Handle both formats
  }

  static async deleteProperty(id) {
    return this.request(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Agent/Profile API - Updated endpoints
  static async getAgentProfile() {
    const response = await this.request('/api/agents/profile');
    return response.agent || response; // Handle both formats
  }

  static async updateAgentProfile(profileData) {
    const response = await this.request('/api/agents/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.agent || response; // Handle both formats
  }

  // Analytics API - Updated endpoints
  static async getAnalytics() {
    const response = await this.request('/api/agents/analytics');
    return response.analytics || response; // Handle both formats
  }

  // Image upload API - Updated endpoint
  static async uploadImages(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await this.request('/api/upload/properties/images', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
    return response.imageUrls || response.urls || []; // Handle both formats
  }

  // Agent avatar upload API
  static async uploadAgentAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await this.request('/api/upload/agents/avatar', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
    return response.imageUrl || response.url; // Handle both formats
  }

  // Additional agent-specific endpoints
  static async getAgentProperties(agentId) {
    const response = await this.request(`/api/agents/${agentId}/properties`);
    return response.properties || response;
  }

  static async getAgentStats(agentId) {
    const response = await this.request(`/api/agents/${agentId}/stats`);
    return response.stats || response;
  }

  // Admin-specific endpoints
  static async getAdminDashboardStats() {
    const response = await this.request('/api/admin/dashboard/stats');
    return response;
  }

  static async getAdminAgents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/api/admin/agents${queryString ? `?${queryString}` : ''}`);
    return response;
  }

  static async getAdminAnalytics(period = '30d') {
    const response = await this.request(`/api/admin/analytics?period=${period}`);
    return response.analytics || response;
  }

  // Enhanced analytics for both admin and agent
  static async getDashboardAnalytics(period = '30d') {
    const response = await this.request(`/api/agents/analytics?period=${period}`);
    return response.analytics || response;
  }

  // Agent management endpoints
  static async createAgent(agentData) {
    const response = await this.request('/api/admin/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
    return response;
  }

  static async approveAgent(agentId) {
    const response = await this.request(`/api/admin/agents/${agentId}/approve`, {
      method: 'POST'
    });
    return response;
  }

  static async rejectAgent(agentId) {
    const response = await this.request(`/api/admin/agents/${agentId}/reject`, {
      method: 'POST'
    });
    return response;
  }

  static async getAgentDetails(agentId) {
    const response = await this.request(`/api/admin/agents/${agentId}`);
    return response.agent || response;
  }

  // Property approval endpoints for admin
  static async getAdminProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/api/admin/properties${queryString ? `?${queryString}` : ''}`);
    return response;
  }

  static async createAdminProperty(propertyData) {
    const response = await this.request('/api/admin/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
    return response.property || response;
  }

  static async approveProperty(propertyId) {
    const response = await this.request(`/api/admin/properties/${propertyId}/approve`, {
      method: 'POST'
    });
    return response;
  }

  static async rejectProperty(propertyId) {
    const response = await this.request(`/api/admin/properties/${propertyId}/reject`, {
      method: 'POST'
    });
    return response;
  }

  // Leads/Contact management endpoints
  static async getAdminLeads(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/api/admin/leads${queryString ? `?${queryString}` : ''}`);
    return response;
  }

  static async updateContactStatus(contactId, status) {
    const response = await this.request(`/api/admin/contacts/${contactId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response;
  }

  // Admin Reviews management endpoints
  static async getAdminPendingReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/api/admin/reviews/pending${queryString ? `?${queryString}` : ''}`);
    return response;
  }

  static async approveReview(reviewId) {
    const response = await this.request(`/api/admin/reviews/${reviewId}/approve`, {
      method: 'POST'
    });
    return response;
  }

  static async rejectReview(reviewId) {
    const response = await this.request(`/api/admin/reviews/${reviewId}/reject`, {
      method: 'POST'
    });
    return response;
  }

  // Contact form submissions (for leads)
  static async getContactSubmissions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/api/contact/submissions${queryString ? `?${queryString}` : ''}`);
    return response;
  }
}

export default ApiService;
