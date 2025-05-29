import axios from "axios";
import { StorageService } from "../../services/storage.service";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

// Configuración global de axios para manejar cookies
axios.defaults.withCredentials = true;

export const AuthService = {
  async login(identifier: string, password: string, isEmail: boolean) {
    // Verificar si ya hay un token válido
    const existingToken = await StorageService.getItem("userToken");
    
    if (existingToken) {
      try {
        // Verificar si el token existente aún es válido
        const existingUser = await this.getUserProfile();
        return { token: existingToken, user: existingUser };
      } catch (error) {
        console.warn("Token existente no válido, procediendo con nuevo login", error);
        await this.logout(); // Limpiar datos inválidos
      }
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        [isEmail ? "email" : "nickName"]: identifier,
        password,
      });

      const access_token = response.data.access_token;
      if (!access_token) {
        console.error("Error: No se recibió access_token del backend", response.data);
        throw new Error("Access token no recibido");
      }

      // Almacenar tokens y datos de usuario
      await StorageService.setItem("userToken", access_token);
      
      if (response.data.user) {
        await StorageService.setItem("userData", JSON.stringify(response.data.user));
      }

      return {
        token: access_token,
        user: response.data.user,
        refresh_token: response.data.refresh_token // Por si necesitas referencia
      };
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {}, // Body vacío
        {
          withCredentials: true, // Importante para enviar cookies
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.data.access_token) {
        throw new Error("No se recibió nuevo access token");
      }

      // Actualizar el token en el almacenamiento
      await StorageService.setItem("userToken", response.data.access_token);

      // Si el backend devuelve datos de usuario actualizados
      if (response.data.user) {
        await StorageService.setItem("userData", JSON.stringify(response.data.user));
      }

      return response.data.access_token;
    } catch (error) {
      console.error("Error al refrescar token:", error);
      
      // Si el error es 401 (no autorizado), hacer logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Refresh token inválido, cerrando sesión...");
        await this.logout();
      }
      
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const userData = await StorageService.getItem("userData");
      if (!userData) return null;
      
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      return null;
    }
  },

  async getUserProfile() {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No se encontró token de autenticación");

      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar datos de usuario si es necesario
      if (response.data.user) {
        await StorageService.setItem("userData", JSON.stringify(response.data.user));
      }

      return response.data.user;
    } catch (error) {
      console.error("Error al obtener perfil de usuario:", error);
      
      // Si el error es 401, intentar refrescar el token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log("Token expirado, intentando refrescar...");
        try {
          const newToken = await this.refreshToken();
          // Reintentar la solicitud con el nuevo token
          const retryResponse = await axios.get(`${API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          return retryResponse.data.user;
        } catch (refreshError) {
          console.error("Error al refrescar token:", refreshError);
          throw refreshError;
        }
      }
      
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const token = await StorageService.getItem("userToken");
      if (!token) throw new Error("No se encontró token de autenticación");

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
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      throw error;
    }
  },

  async getUserRosetas() {
  try {
    const token = await StorageService.getItem("userToken");
    if (!token) throw new Error("No se encontró token de autenticación");

    const response = await axios.get(`${API_URL}/rosetas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.rosetas; // Asumiendo que la respuesta tiene esta estructura
  } catch (error) {
    console.error("Error al obtener rosetas del usuario:", error);
    throw error;
  }
},


  async logout() {
  try {
    // 1. Obtener el token actual para incluirlo en los headers
    const token = await StorageService.getItem("userToken");
    
    // 2. Hacer la petición de logout con el token en los headers
    await axios.post(
      `${API_URL}/logout`, // Ruta actualizada
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.warn("Error al cerrar sesión en el backend:", error);
    // No relanzamos el error para continuar con el logout local
  } finally {
    // 3. Limpieza local garantizada
    try {
      await StorageService.clearAuthData();
      // Limpiar también la caché de axios por si acaso
      delete axios.defaults.headers.common['Authorization'];
    } catch (storageError) {
      console.error("Error al limpiar almacenamiento:", storageError);
    }
  }
}
};















