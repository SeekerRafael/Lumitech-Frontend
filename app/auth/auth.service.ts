import axios from 'axios';
import { StorageService } from '../../services/storage.service';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

export const AuthService = {
  async login(identifier: string, password: string, isEmail: boolean) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      [isEmail ? 'email' : 'nickName']: identifier,
      password,
    });

    await StorageService.setItem('userToken', response.data.token);
    await StorageService.setItem('userData', JSON.stringify(response.data.user));

    return response.data;
  },

  async getCurrentUser() {
    const userData = await StorageService.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  async getUserProfile() {
    const token = await StorageService.getItem('userToken');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const token = await StorageService.getItem('userToken');
  
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.patch(
      `${API_URL}/change-password`,
      {
        currentPassword,
        userNewPassword: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  async logout() {
    await StorageService.clearAuthData();
  },
};





