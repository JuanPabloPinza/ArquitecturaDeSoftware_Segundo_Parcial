import { apiClient } from './api.client';
import { storage } from '../utils/storage';
import { API_CONFIG } from '../config/api.config';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );
    
    console.log('🔐 Login Response:', JSON.stringify(response, null, 2));
    
    // Manejar diferentes estructuras de respuesta (camelCase y PascalCase)
    const token = response.accessToken || response.AccessToken || response.token || response.Token;
    const user = response.user || response.User || response;
    
    if (!token) {
      throw new Error('No se recibió token de autenticación');
    }
    
    await storage.setToken(token);
    await storage.setUser(user);
    
    console.log('✅ Token guardado correctamente');
    
    return { accessToken: token, user };
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>(
      API_CONFIG.ENDPOINTS.REGISTER,
      data
    );
    
    console.log('📝 Register Response:', JSON.stringify(response, null, 2));
    
    // Manejar diferentes estructuras de respuesta (camelCase y PascalCase)
    const token = response.accessToken || response.AccessToken || response.token || response.Token;
    const user = response.user || response.User || response;
    
    if (!token) {
      throw new Error('No se recibió token de autenticación');
    }
    
    await storage.setToken(token);
    await storage.setUser(user);
    
    console.log('✅ Registro y token guardados correctamente');
    
    return { accessToken: token, user };
  }

  async logout(): Promise<void> {
    await storage.clear();
  }

  async getCurrentUser(): Promise<User | null> {
    return storage.getUser<User>();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await storage.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
