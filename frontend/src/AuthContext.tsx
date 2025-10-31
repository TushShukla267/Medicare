import React, { createContext, useState, useContext, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  role: "patient" | "doctor" | "admin" | "guardian" | null;
  setAuth: (token: string, role: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<AuthContextType["role"]>(null);

  const setAuth = (tok: string, userRole: string) => {
    setToken(tok);
    setRole(userRole as AuthContextType["role"]);
  };

  const clearAuth = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
