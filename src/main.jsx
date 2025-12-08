import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PortfolioProvider>
      <WalletProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </WalletProvider>
    </PortfolioProvider>
  </AuthProvider>
);
