import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../services/apiFetch";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);

  const loadPortfolio = async () => {
    try {
      const res = await apiFetch("/portfolio/all", "GET");
      setPortfolio(res.Holdings || []);
    } catch (err) {
      console.error("Portfolio Load Error:", err);
    }
  };

  // ✅ AUTO FETCH ON APP LOAD
  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolio, loadPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
