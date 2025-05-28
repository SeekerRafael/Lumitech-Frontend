import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "../../interfaces/types";
import { StorageService } from "../../services/storage.service";
import { AuthService } from "../auth/auth.service";

interface JwtPayload {
  exp: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeout = useRef<number | null>(null);
  const isRefreshing = useRef(false); // <-- Nuevo control

  const scheduleRefresh = (token: string) => {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      const expiresAt = exp * 1000;
      const now = Date.now();
      const delay = expiresAt - now - 2 * 60 * 1000;

      console.log(
        `[Auth] Token expira en ${Math.round((expiresAt - now) / 1000)} segundos. Programando refresh en ${Math.round(delay / 1000)} segundos.`
      );

      if (delay <= 0) {
        console.log("[Auth] Token expirado o a punto de expirar, refrescando ahora.");
        refreshTokenNow();
      } else {
        if (refreshTimeout.current !== null) {
          clearTimeout(refreshTimeout.current);
          console.log("[Auth] Limpiando timeout anterior.");
          refreshTimeout.current = null;
        }

        refreshTimeout.current = window.setTimeout(() => {
          console.log("[Auth] Timeout alcanzado, refrescando token.");
          refreshTokenNow();
        }, delay);
      }
    } catch (error) {
      console.error("[Auth] Error decodificando token para refresh:", error);
    }
  };

  const refreshTokenNow = async () => {
    if (isRefreshing.current) {
      console.log("[Auth] Refresh ya en curso, evitando ejecución duplicada.");
      return;
    }

    isRefreshing.current = true;

    try {
      console.log("[Auth] Refrescando token...");
      const newToken = await AuthService.refreshToken();
      console.log("[Auth] Token actualizado:", newToken);

      await StorageService.setItem("userToken", newToken);
      scheduleRefresh(newToken);

      const fullProfile = await AuthService.getUserProfile();
      setUser(fullProfile);
      console.log("[Auth] Perfil de usuario actualizado tras refresh.");
    } catch (error) {
      console.error("[Auth] Error al refrescar token, cerrando sesión:", error);
      await AuthService.logout();
      setUser(null);
    } finally {
      isRefreshing.current = false;
    }
  };

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await StorageService.getItem("userToken");

      if (!token) {
        console.log("[Auth] No hay token, usuario no autenticado.");
        setUser(null);
        return;
      }

      scheduleRefresh(token);

      try {
        const fullProfile = await AuthService.getUserProfile();
        console.log("[Auth] Perfil cargado correctamente.");
        setUser(fullProfile);
      } catch (error: any) {
        if (error.response?.status === 401) {
          if (!isRefreshing.current) {
            console.log("[Auth] Token expirado, intentando refresh...");
            await refreshTokenNow();
          } else {
            console.log("[Auth] Refresh ya en curso, esperando...");
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("[Auth] Error al cargar perfil:", error);
      const fallbackUser = await AuthService.getCurrentUser();
      setUser(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    return () => {
      if (refreshTimeout.current !== null) {
        clearTimeout(refreshTimeout.current);
        console.log("[Auth] Timeout de refresh limpiado al desmontar.");
      }
    };
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








