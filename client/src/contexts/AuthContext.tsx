"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import authFetch from "@/services/fetch";
import { useAlert } from "./AlertContext";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const { showAlert } = useAlert();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authFetch(
          "/auth/check",
          { method: "GET" },
          setIsAuthenticated
        );
        setIsAuthenticated(response?.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: Credentials) => {
    try {
      const response = await authFetch(
        "/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        },
        setIsAuthenticated
      );

      if (!response) {
        setIsAuthenticated(false);
        return null;
      }

      setIsAuthenticated(response.status === 200);
      return response;
    } catch (error: any) {
      console.log("Login Failed", error.message);
      setIsAuthenticated(false);
      return null;
    }
  };

  const register = async (credentials: Credentials) => {
    try {
      const response = await authFetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      setIsAuthenticated(response?.status === 201);
      return response;
    } catch (error: any) {
      showAlert("Register Failed", error.message);
      setIsAuthenticated(false);
      return null;
    }
  };

  const logout = async () => {
    try {
      await authFetch("/logout", { method: "GET" });
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
