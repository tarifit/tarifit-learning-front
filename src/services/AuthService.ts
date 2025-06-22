import { environment } from '../environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ValidationResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

class AuthService {
  private baseUrl = environment.services.auth.baseUrl;
  private endpoints = environment.services.auth.endpoints;

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  }

  async validateToken(token?: string): Promise<ValidationResponse> {
    const authToken = token || this.getToken();
    
    if (!authToken) {
      return { valid: false };
    }

    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.validate}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();
      return { valid: true, user: data.user };
    } catch (error) {
      console.error('Token validation failed:', error);
      return { valid: false };
    }
  }

  async refreshToken(): Promise<string | null> {
    const currentToken = this.getToken();
    
    if (!currentToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.refresh}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        return data.token;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getCurrentUser(): Promise<any> {
    const validation = await this.validateToken();
    return validation.valid ? validation.user : null;
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token 
      ? { 'Authorization': `Bearer ${token}` }
      : {};
  }
}

export default new AuthService();