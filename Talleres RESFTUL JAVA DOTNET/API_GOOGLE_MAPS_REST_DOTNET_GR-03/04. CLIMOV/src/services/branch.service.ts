import { apiClient } from './api.client';
import { API_CONFIG } from '../config/api.config';

export interface Branch {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBranchRequest {
  name: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  email: string;
}

export interface UpdateBranchRequest {
  name: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

class BranchService {
  async getAll(): Promise<Branch[]> {
    return apiClient.get<Branch[]>(API_CONFIG.ENDPOINTS.BRANCHES);
  }

  async getById(id: number): Promise<Branch> {
    return apiClient.get<Branch>(API_CONFIG.ENDPOINTS.BRANCH_BY_ID(id));
  }

  async create(data: CreateBranchRequest): Promise<Branch> {
    return apiClient.post<Branch>(API_CONFIG.ENDPOINTS.BRANCHES, data);
  }

  async update(id: number, data: UpdateBranchRequest): Promise<Branch> {
    return apiClient.put<Branch>(API_CONFIG.ENDPOINTS.BRANCH_BY_ID(id), data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_CONFIG.ENDPOINTS.BRANCH_BY_ID(id));
  }
}

export const branchService = new BranchService();
