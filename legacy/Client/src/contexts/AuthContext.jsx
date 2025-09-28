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
        const response = await authFetch(
          "/auth/check",
          {
            method: "GET",
          },
          setIsAuthenticated
        );
        console.log(response);

        if (response) {
          setIsAuthenticated(response.status === 200);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        return;
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const loginResponse = await authFetch(
        "/login",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: "include",
        },
        setIsAuthenticated
      );

      if (!loginResponse) {
        setIsAuthenticated(false);
        return null;
      }

      if (loginResponse.status === 200) {
        setIsAuthenticated(true);
        return loginResponse;
      }
      if (loginResponse.status !== 200) {
        setIsAuthenticated(false);
        return loginResponse;
      }
    } catch (error) {
      console.log("Login Failed", error.message);
      setIsAuthenticated(false);
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
        return registerResponse;
      } else {
        setIsAuthenticated(false);
        return registerResponse;
      }
    } catch (error) {
      showAlert("Login Failed", error.message);
      setIsAuthenticated(false);
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
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
