import { apiClient } from './api.client';
import { API_CONFIG } from '../config/api.config';
import type { 
  Transaction, 
  DepositRequest, 
  WithdrawalRequest, 
  TransferRequest 
} from '../types';

class TransactionService {
  async getAll(): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(API_CONFIG.ENDPOINTS.TRANSACTIONS);
  }

  async getById(id: number): Promise<Transaction> {
    return apiClient.get<Transaction>(API_CONFIG.ENDPOINTS.TRANSACTION_BY_ID(id));
  }

  async getByAccountId(accountId: number): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(
      API_CONFIG.ENDPOINTS.TRANSACTIONS_BY_ACCOUNT(accountId)
    );
  }

  async deposit(data: DepositRequest): Promise<Transaction> {
    return apiClient.post<Transaction>(API_CONFIG.ENDPOINTS.DEPOSIT, data);
  }

  async withdraw(data: WithdrawalRequest): Promise<Transaction> {
    return apiClient.post<Transaction>(API_CONFIG.ENDPOINTS.WITHDRAWAL, data);
  }

  async transfer(data: TransferRequest): Promise<Transaction> {
    return apiClient.post<Transaction>(API_CONFIG.ENDPOINTS.TRANSFER, data);
  }
}

export const transactionService = new TransactionService();
