import axios from "axios";
import Constants from "expo-constants";
import { StorageService } from "./storage.service";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/roseta`;

axios.defaults.withCredentials = true;

export const RosetaService = {
  async registerRoseta(data: {
    nombre: string;
    ubicacion: string;
    tipo: string;
    descripcion?: string;
  }) {
    try {
      const token = await StorageService.getItem("userToken");

      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al registrar roseta:", error);
      throw error;
    }
  },
};
