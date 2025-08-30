// Enhanced response handler to prevent JSON parsing errors
export class ResponseHandler {
  static async safeJsonParse(response) {
    const contentType = response.headers.get('content-type') || '';
    
    // Check if response has content
    if (!response.body || response.status === 204) {
      return null;
    }
    
    // Only attempt JSON parsing for JSON content types
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.warn('Non-JSON response received:', {
        status: response.status,
        contentType,
        body: text.substring(0, 200)
      });
      
      // For non-JSON responses, return the text and indicate it's not JSON
      return {
        _isJson: false,
        _contentType: contentType,
        _status: response.status,
        _text: text
      };
    }
    
    try {
      const text = await response.text();
      
      // Handle empty responses
      if (!text.trim()) {
        return null;
      }
      
      // Attempt JSON parsing
      return JSON.parse(text);
    } catch (error) {
      console.error('JSON parsing failed:', error);
      
      // Return error information instead of throwing
      return {
        _isJson: false,
        _error: 'JSON_PARSE_ERROR',
        _status: response.status,
        _message: 'Invalid JSON response from server'
      };
    }
  }
  
  static async handleApiResponse(response) {
    const data = await this.safeJsonParse(response);
    
    if (!response.ok) {
      // Handle HTTP errors
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (data && typeof data === 'object' && data._isJson !== false) {
        // Use server-provided error message if available
        errorMessage = data.error || data.message || errorMessage;
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.statusText = response.statusText;
      error.response = data;
      throw error;
    }
    
    return data;
  }
}
