import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const registerUser = (data: {
  userName: string;
  userLastName: string;
  userNickName: string;
  userEmail: string;
  userPassword: string;
}) => {
  return axios.post(`${BASE_URL}/user/register`, data);
};
