"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAlert } from "./AlertContext";

type ErrorObject = {
  status?: number;
  message?: string;
};

type AlertOnError = (name: string, errorObject?: ErrorObject) => void;

const ErrorContext = createContext<AlertOnError | undefined>(undefined);

export const useError = (): AlertOnError => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const ErrorProvider = ({ children }: Props) => {
  const { showAlert } = useAlert();

  const errorMap: Record<number, string> = {
    400: "Bad request. Please check your input.",
    401: "Unauthorized access. Please log in again.",
    403: "Forbidden request. You do not have permission.",
    404: "Requested resource not found.",
    409: "Conflict detected. The resource already exists.",
    500: "Internal server error. Please try again later.",
    502: "Bad gateway. The server received an invalid response.",
    503: "Service unavailable. Please try again later.",
    504: "Gateway timeout. The server took too long to respond.",
  };

  const alertOnError: AlertOnError = (name, errorObject) => {
    const message =
      errorObject?.message ||
      (typeof errorObject?.status === "number" ? errorMap[errorObject.status] : undefined) ||
      "An unexpected error occurred. Please try again.";
    showAlert(name, message);
  };

  return (
    <ErrorContext.Provider value={alertOnError}>
      {children}
    </ErrorContext.Provider>
  );
};
