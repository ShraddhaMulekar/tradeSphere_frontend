import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../api/api.js";
import { parseJwt } from "../utils/jwtUtils.js";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch wallet balance
  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Add cache-buster to prevent stale data
      const res = await fetch(`${API_BASE_URL}/auth/all-users?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Get current user from token consistently
      const decoded = parseJwt(token);
      if (!decoded) return;

      const currentUserId = decoded.userId || decoded.id || decoded._id || decoded.sub;
      const currentUser = data.users.find(u => u._id === currentUserId);

      if (currentUser) {
        setWallet(currentUser.wallet || 0);
      }
    } catch (error) {
      console.error("Wallet fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      // Try to update state immediately from response if backend supports it
      const newBalance = data.wallet ?? data.newBalance ?? data.balance;
      if (typeof newBalance === 'number') {
        setWallet(newBalance);
      }

      // Re-fetch to be safe and ensure all state is sync
      await fetchWallet();
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

      // Try to update state immediately from response if backend supports it
      const newBalance = data.wallet ?? data.newBalance ?? data.balance;
      if (typeof newBalance === 'number') {
        setWallet(newBalance);
      }

      // Re-fetch instead of local math to ensure sync with backend logic
      await fetchWallet();
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, addMoney, withdrawMoney, loading, refreshWallet: fetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);