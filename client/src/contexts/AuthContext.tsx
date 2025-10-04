"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import authFetch from "@/services/fetch";

interface Credentials {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => void;
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✅ helper to fetch user profile
  const fetchCurrentUser = async () => {
    try {
      const response = await fetchWithAuth("/accounts/me/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      console.log("Fetch current user response:", response);

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Failed to fetch current user", error);
    }

    // fallback if failed
    setCurrentUser(null);
    setIsAuthenticated(false);
    return false;
  };

  // ✅ run on reload to restore session
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, []);

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
        setCurrentUser(null);
        return false;
      }

      const data = await response.json();

      if (data.access) {
        sessionStorage.setItem("access_token", data.access);
        setIsAuthenticated(true);
        // fetch user profile right after login
        return await fetchCurrentUser();
      }

      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const fetchWithAuth = async (path: string, options?: RequestInit) => {
    try {
      return await authFetch(path, options);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "unauthenticated" in error &&
        error.unauthenticated
      ) {
        logout();
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout, fetchWithAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
