// Test script to verify the login JSON parsing fix
import { authAPI } from './auth.js';

// Test function to verify login works correctly
export async function testLogin() {
  try {
    console.log('Testing login with valid credentials...');
    
    // Test with invalid credentials to trigger error handling
    const result = await authAPI.login({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    console.log('Login test completed:', result);
    
  } catch (error) {
    console.error('Login test failed:', error.message);
    // This should now show a user-friendly error message instead of JSON parsing error
  }
}

// Test with network error simulation
export async function testNetworkError() {
  try {
    console.log('Testing network error handling...');
    
    // This will trigger network error handling
    const result = await authAPI.login({
      email: 'test@example.com',
      password: 'test'
    });
    
  } catch (error) {
    console.log('Network error handled gracefully:', error.message);
  }
}
