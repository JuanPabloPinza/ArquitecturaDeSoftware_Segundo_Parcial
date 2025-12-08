// Types para la API
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  role: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface Account {
  id: number;
  accountNumber: string;
  accountType: number;
  balance: number;
  isActive: boolean;
  userId: number;
  userFullName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAccountRequest {
  userId: number;
  accountType: number;
  initialBalance: number;
}

export interface Transaction {
  id: number;
  transactionType: number;
  amount: number;
  description: string;
  accountId: number;
  accountNumber: string;
  destinationAccountId?: number;
  destinationAccountNumber?: string;
  createdAt: string;
}

export interface DepositRequest {
  accountId: number;
  amount: number;
  description?: string;
}

export interface WithdrawalRequest {
  accountId: number;
  amount: number;
  description?: string;
}

export interface TransferRequest {
  sourceAccountId: number;
  destinationAccountId: number;
  amount: number;
  description?: string;
}

// Enums
export enum AccountType {
  Savings = 0,
  Checking = 1,
}

export enum TransactionType {
  Deposit = 0,
  Withdrawal = 1,
  Transfer = 2,
}

export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.Savings]: 'Ahorro Estudiantil',
  [AccountType.Checking]: 'Cuenta Corriente',
};

export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.Deposit]: 'Depósito',
  [TransactionType.Withdrawal]: 'Retiro',
  [TransactionType.Transfer]: 'Transferencia',
};
