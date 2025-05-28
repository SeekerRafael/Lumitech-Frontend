// app/hooks/AuthContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./useAuth"; 

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth(); 
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  console.log("✅ useAuthContext accedido correctamente");
  return context;
};








