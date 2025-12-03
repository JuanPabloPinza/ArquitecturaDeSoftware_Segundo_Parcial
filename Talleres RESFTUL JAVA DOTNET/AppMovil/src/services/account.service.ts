import { apiClient } from './api.client';
import { API_CONFIG } from '../config/api.config';
import type { Account, CreateAccountRequest } from '../types';

class AccountService {
  async getAll(): Promise<Account[]> {
    return apiClient.get<Account[]>(API_CONFIG.ENDPOINTS.ACCOUNTS);
  }

  async getById(id: number): Promise<Account> {
    return apiClient.get<Account>(API_CONFIG.ENDPOINTS.ACCOUNT_BY_ID(id));
  }

  async getByUserId(userId: number): Promise<Account[]> {
    return apiClient.get<Account[]>(API_CONFIG.ENDPOINTS.ACCOUNTS_BY_USER(userId));
  }

  async create(data: CreateAccountRequest): Promise<Account> {
    return apiClient.post<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS, data);
  }

  async update(id: number, data: { isActive: boolean }): Promise<Account> {
    return apiClient.put<Account>(API_CONFIG.ENDPOINTS.ACCOUNT_BY_ID(id), data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_CONFIG.ENDPOINTS.ACCOUNT_BY_ID(id));
  }
}

export const accountService = new AccountService();
