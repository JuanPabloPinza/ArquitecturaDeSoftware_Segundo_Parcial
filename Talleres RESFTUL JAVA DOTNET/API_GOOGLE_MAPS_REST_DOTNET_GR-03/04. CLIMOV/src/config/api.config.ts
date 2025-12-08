import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://172.20.10.2:5238';
    }
    return 'http://localhost:5238';
};

export const API_CONFIG = {
    DOTNET_URL: 'http://localhost:5238',
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
    },
};

export type ApiConfig = typeof API_CONFIG;
