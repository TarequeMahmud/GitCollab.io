import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@styles/index.scss";
import App from "./App.jsx";
import { AuthProvider } from "@contexts/AuthContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ErrorProvider } from "./contexts/ErrorContex.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <ErrorProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ErrorProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>
);
