"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import authFetch from "@/services/fetch";

interface Credentials {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => void;
  fetchWithAuth: (path: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    typeof window !== "undefined" &&
      !!window.sessionStorage.getItem("access_token")
  );

  const login = async (credentials: Credentials) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        }
      );

      if (!response.ok) {
        setIsAuthenticated(false);
        return false;
      }

      const data = await response.json();

      if (data.access) {
        sessionStorage.setItem("access_token", data.access);
        setIsAuthenticated(true);
        return true;
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  const fetchWithAuth = async (path: string, options?: RequestInit) => {
    try {
      return await authFetch(path, options);
    } catch (error: any) {
      if (error.unauthenticated) {
        setIsAuthenticated(false);
        logout();
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, fetchWithAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
