// Reviews API - Updated endpoints
static async getReviews(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
  return response.reviews || response; // Handle both formats
}

static async getReviewStats() {
  const response = await this.request('/reviews/stats');
  return response;
}

static async approveReview(reviewId) {
  const response = await this.request(`/admin/reviews/${reviewId}/approve`, {
    method: 'PATCH'
  });
  return response;
}

static async rejectReview(reviewId) {
  const response = await this.request(`/admin/reviews/${reviewId}/reject`, {
    method: 'PATCH'
  });
  return response;
}

// Contacts/Leads API - Updated endpoints
static async getContacts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await this.request(`/admin/contacts${queryString ? `?${queryString}` : ''}`);
  return response.contacts || response; // Handle both formats
}

static async updateContactStatus(contactId, status) {
  const response = await this.request(`/admin/contacts/${contactId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
  return response;
}

static async getContactDetails(contactId) {
  const response = await this.request(`/admin/contacts/${contactId}`);
  return response.contact || response;
}
