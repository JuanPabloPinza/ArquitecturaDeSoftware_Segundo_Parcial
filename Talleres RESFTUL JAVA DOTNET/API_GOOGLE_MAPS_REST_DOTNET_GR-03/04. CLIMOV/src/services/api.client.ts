import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { storage } from '../utils/storage';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - agregar token y log
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await storage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.data) {
          console.log('📦 Request Body:', JSON.stringify(config.data, null, 2));
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - manejar errores con log detallado
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`✅ Response ${response.status}:`, JSON.stringify(response.data, null, 2));
        return response;
      },
      (error: AxiosError) => {
        console.log('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
        });
        
        if (error.response?.status === 401) {
          // Token expirado o inválido
          storage.clear();
        }
        return Promise.reject(error);
      }
    );
  }

  // Cambiar URL base dinámicamente
  setBaseUrl(url: string): void {
    this.instance.defaults.baseURL = url;
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.instance.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
