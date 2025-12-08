import React, { useEffect, useState } from "react";
import { useWatchlist } from "../hooks/useWatchlist";
import { API_BASE_URL } from "../api/api";
import BuyForm from "../components/BuyForm";

export default function Watchlist() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const [symbol, setSymbol] = useState("");
  const [prices, setPrices] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);

  /* ================= FETCH PRICE ================= */
  const fetchPrice = async (symbol) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${API_BASE_URL}/stock/quote/${symbol}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        console.error("Price fetch failed", res.status);
        return null;
      }
      const data = await res.json();
      return data.price ?? null;
    } catch (err) {
      console.error("fetchPrice error:", err);
      return null;
    }
  };

  /* ================= LOAD PRICES ================= */
  useEffect(() => {
    const loadPrices = async () => {
      setLoadingPrices(true);
      try {
        const entries = await Promise.all(
          watchlist.map(async (s) => [s, await fetchPrice(s)])
        );
        setPrices(Object.fromEntries(entries));
      } finally {
        setLoadingPrices(false);
      }
    };

    if (watchlist.length) loadPrices();
    else setPrices({});
  }, [watchlist]);

  /* ================= ADD STOCK ================= */
  const handleAdd = async () => {
    if (!symbol.trim()) return alert("Enter symbol");
    await addToWatchlist(symbol.toUpperCase());
    setSymbol("");
  };

  /* ================= OPEN BUY FORM ================= */
  const handleBuyClick = (item, price) => {
    setSelectedStock({
      symbol: item,
      currentPrice: price,
    });
  };

  return (
    <div className="watchlist-container">
      <h2>📊 My Watchlist</h2>

      <div className="add-section">
        <input
          placeholder="Enter Share Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {watchlist.length === 0 && <p>No stocks in watchlist.</p>}

      {watchlist.map((item) => {
        const cp = prices[item];
        const isAvailable = cp !== undefined && cp !== null;

        return (
          <div className="watchlist-card" key={item}>
            <div>
              <h3>{item}</h3>
              <p>{loadingPrices ? "Loading..." : isAvailable ? `₹ ${cp}` : "Not Available"}</p>
            </div>

            <div>
              <button
                className="buy-btn"
                disabled={!isAvailable}
                onClick={() => handleBuyClick(item, cp)}
              >
                BUY
              </button>

              <button
                className="remove-btn"
                onClick={() => removeFromWatchlist(item)}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}

      {/* Buy Form Modal */}
      {selectedStock && (
        <BuyForm
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={() => {
            alert("Buy successful");
          }}
        />
      )}

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */
const css = `
.watchlist-container { 
  max-width: 800px; 
  margin: 40px auto; 
  padding: 20px; 
}

.watchlist-container h2 {
  text-align: center;
  font-size: 28px;
  color: #1e293b;
  margin-bottom: 24px;
}

.add-section { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 24px; 
}

.add-section input { 
  flex: 1; 
  padding: 12px 16px; 
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  font-size: 16px;
}

.add-section input:focus {
  outline: none;
  border-color: #3b82f6;
}

.add-section button { 
  padding: 12px 24px; 
  background: #2563eb; 
  color: white; 
  border: none; 
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-section button:hover {
  background: #1d4ed8;
}

.watchlist-card { 
  background: #f8fafc; 
  padding: 16px; 
  border-radius: 12px; 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 12px; 
  align-items: center;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.watchlist-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #cbd5e1;
}

.watchlist-card h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #1e40af;
  font-weight: 700;
}

.watchlist-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.watchlist-card > div:last-child {
  display: flex;
  gap: 8px;
}

.buy-btn { 
  background: #16a34a; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  cursor: pointer; 
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.buy-btn:hover:not(:disabled) {
  background: #15803d;
}

.buy-btn:disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
}

.remove-btn { 
  background: #ef4444; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  cursor: pointer; 
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #dc2626;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .watchlist-container {
    padding: 15px;
    margin: 20px auto;
  }

  .watchlist-container h2 {
    font-size: 24px;
  }

  .add-section {
    flex-direction: column;
  }

  .add-section button {
    width: 100%;
  }

  .watchlist-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .watchlist-card > div:last-child {
    width: 100%;
    justify-content: space-between;
  }

  .buy-btn,
  .remove-btn {
    flex: 1;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .watchlist-card h3 {
    font-size: 16px;
  }

  .watchlist-card p {
    font-size: 13px;
  }
}
`;