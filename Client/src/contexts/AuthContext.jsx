import { createContext, useState, useEffect, useContext } from "react";
import authFetch from "@services/fetch.js";
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  //fetch the login state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authFetch("/auth/check", {
          method: "GET",
        });
        setIsAuthenticated(response.loggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const userData = await authFetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!userData.loggedIn) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (userData.loggedIn) {
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    await authFetch("/logout", {
      method: "GET",
    });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
