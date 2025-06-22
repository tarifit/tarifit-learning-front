// Simple test file to verify service configuration
import { environment } from './environment';
import AuthService from './AuthService';
import ContentService from './ContentService';
import UserService from './UserService';
import LearningService from './LearningService';

export const testServices = () => {
  console.log('Environment configuration:', environment);
  
  console.log('Auth Service configured with base URL:', environment.services.auth.baseUrl);
  console.log('Content Service configured with base URL:', environment.services.content.baseUrl);
  console.log('User Service configured with base URL:', environment.services.user.baseUrl);
  console.log('Learning Service configured with base URL:', environment.services.learning.baseUrl);
  
  console.log('Auth Service methods:', Object.getOwnPropertyNames(AuthService));
  console.log('Content Service methods:', Object.getOwnPropertyNames(ContentService));
  console.log('User Service methods:', Object.getOwnPropertyNames(UserService));
  console.log('Learning Service methods:', Object.getOwnPropertyNames(LearningService));
  
  return {
    environment,
    services: {
      auth: AuthService,
      content: ContentService,
      user: UserService,
      learning: LearningService
    }
  };
};

// Test function to check if backend services are accessible
export const testBackendConnectivity = async () => {
  const results = {};
  
  try {
    // Test Content Service health check
    console.log('Testing Content Service health...');
    const contentHealth = await ContentService.healthCheck();
    results.content = { status: 'success', data: contentHealth };
    console.log('Content Service health:', contentHealth);
  } catch (error) {
    results.content = { status: 'error', error: error.message };
    console.error('Content Service health check failed:', error);
  }
  
  // Note: Other services might not have health endpoints implemented yet
  // This is just to test CORS and basic connectivity
  
  return results;
};