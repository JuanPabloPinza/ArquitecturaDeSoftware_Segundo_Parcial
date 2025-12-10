import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'eureka_token';
const USER_KEY = 'eureka_user';

export const storage = {
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async setUser(user: object): Promise<void> {
    const userStr = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, userStr);
    if (Platform.OS === 'web') {
      localStorage.setItem(USER_KEY, userStr);
    }
  },

  async getUser<T>(): Promise<T | null> {
    if (Platform.OS === 'web') {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
    if (Platform.OS === 'web') {
      localStorage.removeItem(USER_KEY);
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
    if (Platform.OS === 'web') {
      localStorage.clear();
      sessionStorage.clear();
    }
  },
};
