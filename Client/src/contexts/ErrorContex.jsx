import { createContext, useContext } from "react";
import { useAlert } from "./AlertContext";
const ErrorContext = createContext();
export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const errorMap = {
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

  const alertOnError = (name, errorObject) => {
    const message =
      errorObject.message ||
      errorMap[errorObject?.status] ||
      "An unexpected error occurred. Please try again.";
    showAlert(`${name}`, `${message}`);
  };

  return (
    <ErrorContext.Provider value={alertOnError}>
      {children}
    </ErrorContext.Provider>
  );
};
