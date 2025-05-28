import axios from "axios";
import { StorageService } from "../../services/storage.service";
import Constants from "expo-constants";

import { AuthService } from "../auth/auth.service";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const ROSETTA_URL = `${BASE_URL}/roseta`;

// Configuración global de axios (ya debería estar en tu AuthService)
axios.defaults.withCredentials = true;

export const RosettaService = {
  async sendCredentialsToRosetta(ssid: string, password: string) {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No autenticado");

      // Enviar credenciales al ESP32 (directamente al AP del ESP32)
      const esp32Response = await axios.post(
        "http://192.168.4.1/configure",
        {
          wifi_ssid: ssid,
          wifi_password: password,
        },
        {
          timeout: 10000,
        }
      );

      return esp32Response.data;
    } catch (error) {
      console.error("Error al enviar credenciales al ESP32:", error);
      throw new Error(
        "No se pudo comunicar con la roseta. ¿Estás conectado a su WiFi?"
      );
    }
  },

  async checkRosettaIPAvailable() {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No autenticado");

      const response = await axios.get(`${ROSETTA_URL}/check-ip`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.ipAvailable;
    } catch (error) {
      console.error("Error al verificar IP:", error);
      throw error;
    }
  },

  async registerRosetta(ubication: string) {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No autenticado");

      // 1. Registrar la roseta
      const registerResponse = await axios.post(
        `${ROSETTA_URL}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Obtener la MAC de la respuesta (asumiendo que el backend la devuelve)
      const macAddress = registerResponse.data.mac;

      // 3. Actualizar la ubicación
      await axios.patch(
        `${ROSETTA_URL}/change-ubication`,
        {
          rosette_mac: macAddress,
          ubication: ubication,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return registerResponse.data;
    } catch (error) {
      console.error("Error al registrar roseta:", error);

      // Manejar error de token expirado
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const newToken = await AuthService.refreshToken();
          // Reintentar el registro con el nuevo token
          return this.registerRosetta(ubication);
        } catch (refreshError) {
          console.error("Error al refrescar token:", refreshError);
          throw refreshError;
        }
      }

      throw error;
    }
  },

  async getAllRosettes() {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No autenticado");

      const response = await axios.get(`${ROSETTA_URL}/get-all-rosettes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error al obtener rosetas:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const newToken = await AuthService.refreshToken();
          return this.getAllRosettes();
        } catch (refreshError) {
          console.error("Error al refrescar token:", refreshError);
          throw refreshError;
        }
      }

      throw error;
    }
  },

  async removeRosetta(mac: string) {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No autenticado");

      const response = await axios.delete(
        `${ROSETTA_URL}/remove-rosette/${mac}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al eliminar roseta:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const newToken = await AuthService.refreshToken();
          return this.removeRosetta(mac);
        } catch (refreshError) {
          console.error("Error al refrescar token:", refreshError);
          throw refreshError;
        }
      }

      throw error;
    }
  },
};