import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.40.29.241:8080';
    }
    return 'http://10.40.29.241:8080';
};

export const API_CONFIG = {
    DOTNET_URL: 'http://10.40.29.241:5238',
    JAVA_URL: 'http://localhost:8080',

    BASE_URL: getBaseUrl(),

    ENDPOINTS: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',

        // Accounts
        ACCOUNTS: '/api/account',
        ACCOUNT_BY_ID: (id: number) => `/api/account/${id}`,
        ACCOUNTS_BY_USER: (userId: number) => `/api/account/user/${userId}`,

        // Transactions
        TRANSACTIONS: '/api/transaction',
        TRANSACTION_BY_ID: (id: number) => `/api/transaction/${id}`,
        TRANSACTIONS_BY_ACCOUNT: (accountId: number) => `/api/transaction/account/${accountId}`,
        DEPOSIT: '/api/transaction/deposit',
        WITHDRAWAL: '/api/transaction/withdrawal',
        TRANSFER: '/api/transaction/transfer',

        // Branches
        BRANCHES: '/api/branch',
        BRANCH_BY_ID: (id: number) => `/api/branch/${id}`,
    },
};

export type ApiConfig = typeof API_CONFIG;
