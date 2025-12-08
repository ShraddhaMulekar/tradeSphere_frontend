import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../api/api.js";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch wallet balance on load
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/auth/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        
        // Get current user from token
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentUser = data.users.find(u => u._id === decoded.userId);
        
        if (currentUser) {
          setWallet(currentUser.wallet || 0);
        }
      } catch (error) {
        console.error("Wallet fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  // ADD MONEY
  const addMoney = async (amount) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/wallet/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setWallet(data.wallet); // ✅ Use backend response
      return data;
    } catch (error) {
      throw error;
    }
  };

  // WITHDRAW
  const withdrawMoney = async (amount) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/wallet/withdrawal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setWallet((prev) => prev - amount);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, addMoney, withdrawMoney, loading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);