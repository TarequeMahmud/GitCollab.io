import { createContext, useContext, useState, useRef } from "react";

export const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const timeoutRef = useRef(null);
  const showAlert = (title, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlert({ title, message });

    timeoutRef.current = setTimeout(() => {
      setAlert(null);
      timeoutRef.current = null;
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
