"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import authFetch from "@/services/fetch";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<boolean>;
  register: (data: User) => Promise<boolean>;
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

  /** ---------------------------
   *  🔐 Authenticated fetch
   * --------------------------- */
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

  /** ---------------------------
   *  🚪 Logout
   * --------------------------- */
  const logout = async () => {
    try {
      await authFetch("/auth/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      sessionStorage.removeItem("access_token");
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  /** ---------------------------
   *  👤 Fetch Current User
   * --------------------------- */
  const fetchCurrentUser = async () => {
    try {
      const response = await fetchWithAuth("/accounts/me/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Failed to fetch current user", error);
    }

    setCurrentUser(null);
    setIsAuthenticated(false);
    return false;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, []);

  /** ---------------------------
   *  🔑 Login via Public Proxy
   * --------------------------- */
  const login = async (credentials: Credentials) => {
    try {
      const response = await fetch("/api/public/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Login failed", await response.text());
        setIsAuthenticated(false);
        setCurrentUser(null);
        return false;
      }

      const data = await response.json();
      if (data.access) {
        sessionStorage.setItem("access_token", data.access);
        setIsAuthenticated(true);
        return await fetchCurrentUser();
      }

      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
  };


  /** ---------------------------
   *  📝 Register via Public Proxy
   * --------------------------- */
  const register = async (data: User) => {
    try {
      const response = await fetch("/api/public/accounts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Registration failed:", await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        register,
        logout,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
