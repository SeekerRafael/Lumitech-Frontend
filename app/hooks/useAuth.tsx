import { useState, useEffect, useCallback } from "react";
import { AuthService } from "../auth/auth.service";
import { User } from "../../interfaces/types";
import { StorageService } from "../../services/storage.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = await StorageService.getItem("userToken");

      if (!token) {
        setUser(null);
        return;
      }

      const fullProfile = await AuthService.getUserProfile();
      console.log("Perfil completo cargado:", fullProfile);
      setUser(fullProfile);
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
