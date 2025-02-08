import { createContext, useState, useEffect, useContext } from "react";
import authFetch from "@services/fetch.js";
import { useAlert } from "./AlertContext";
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  //fetch the login state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authFetch("/auth/check", {
          method: "GET",
        });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authFetch("/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      console.log("userData: ---", userData);

      if (userData.status === 200) {
        setIsAuthenticated(true);
        return userData.data;
      }
      if (userData.status !== 200) {
        setIsAuthenticated(false);
        return { status: userData.status, error: true };
      }
    } catch (error) {
      console.log("Login Failed", error.message);

      return null;
    }
  };

  const register = async (credentials) => {
    try {
      const registerResponse = await authFetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (registerResponse.status === 201) {
        setIsAuthenticated(true);
        return registerResponse.data;
      } else {
        setIsAuthenticated(false);
        return { status: registerResponse.status, error: true };
      }
    } catch (error) {
      showAlert("Login Failed", error.message);
      return null;
    }
  };

  const logout = async () => {
    await authFetch("/logout", {
      method: "GET",
    });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
