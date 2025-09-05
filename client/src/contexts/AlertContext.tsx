"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type Alert = {
  title: string;
  message: string;
} | null;

type AlertContextType = {
  alert: Alert;
  showAlert: (title: string, message: string) => void;
  setAlert: Dispatch<SetStateAction<Alert>>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showAlert = (title: string, message: string) => {
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
