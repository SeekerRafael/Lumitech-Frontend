import { useState, useEffect, useCallback } from "react";
import { AuthService } from "../auth/auth.service";
import { User } from "../../interfaces/types";
import { StorageService } from "../../services/storage.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      let token = await StorageService.getItem("userToken");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const fullProfile = await AuthService.getUserProfile();
        setUser(fullProfile);
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            token = await AuthService.refreshToken();

            const fullProfile = await AuthService.getUserProfile();
            setUser(fullProfile);
          } catch (refreshError) {
            await AuthService.logout();
            setUser(null);
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      const fallbackUser = await AuthService.getCurrentUser();
      setUser(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = async () => {
    setIsLoading(true);
    await loadUser();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: AuthService.login,
    logout: AuthService.logout,
    refreshUser,
  };
}
