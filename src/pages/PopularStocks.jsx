import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/api";
import BuyForm from "../components/BuyForm";
import Navbar from "../components/Navbar";

export default function PopularStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [debugError, setDebugError] = useState(null);

  useEffect(() => {
    fetchPopularStocks();
  }, []);

  const fetchPopularStocks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/stock/popular`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("Popular Response:", data); // Debugging

      // Robust parsing: check for data.stocks OR data.Data OR direct array
      const validStocks = data.stocks || data.Data || (Array.isArray(data) ? data : []);

      setStocks(validStocks);
    } catch (err) {
      console.error("Error fetching popular stocks:", err);
      setDebugError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/watchlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add");
        return;
      }

      alert(`${symbol} added to watchlist!`);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      alert("Failed to add to watchlist");
    }
  };

  const handleBuyClick = (stock) => {
    setSelectedStock({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      currentPrice: stock.price,
    });
  };

  return (
    <div className="markets-page">
      <Navbar /> {/* EXPLICIT NAVBAR */}

      <div className="m-container">
        <div className="m-header">
          <h1 className="m-title">Market <span className="text-gradient">Movers</span></h1>
          <p className="m-subtitle">Top trending assets making waves today</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading market data...</p>
          </div>
        ) : stocks.length === 0 ? (
          <div className="empty-state glass-panel">
            <h3>No market data available</h3>
            <p>We couldn't load the popular stocks at this time.</p>
            {debugError && <p className="error-text">Error: {debugError}</p>}
            <button className="btn-retry" onClick={fetchPopularStocks}>Retry</button>
          </div>
        ) : (
          <div className="m-grid">
            {stocks.map((stock, index) => {
              const isPositive = stock.change >= 0;
              // Dynamic gradient based on performance
              const cardBg = isPositive
                ? "linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))"
                : "linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02))";

              const borderColor = isPositive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)";

              return (
                <div
                  key={stock.symbol}
                  className="m-card"
                  style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`
                  }}
                >
                  <div className="m-card-top">
                    <div className="m-sym-group">
                      <span className="m-symbol">{stock.symbol}</span>
                      <span className="m-name">{stock.name}</span>
                    </div>
                    <div className={`m-badge ${isPositive ? 'badge-green' : 'badge-red'}`}>
                      {isPositive ? '↗' : '↘'}
                    </div>
                  </div>

                  <div className="m-card-price-area">
                    <span className="m-price">${stock.price.toFixed(2)}</span>
                    <span className={`m-change ${isPositive ? 'text-green' : 'text-red'}`}>
                      {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="m-actions">
                    <button
                      className="btn-glass"
                      onClick={() => addToWatchlist(stock.symbol)}
                    >
                      + Watch
                    </button>
                    <button
                      className="btn-trade"
                      onClick={() => handleBuyClick(stock)}
                    >
                      Trade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedStock && (
        <BuyForm
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={() => alert("Order Executed Successfully!")}
        />
      )}

      <style>{css}</style>
    </div>
  );
}

const css = `
.markets-page {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

.m-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.m-header {
  margin-bottom: 40px;
  text-align: center;
}

.m-title {
  font-size: 42px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.text-gradient {
  background: linear-gradient(to right, #bef264, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.m-subtitle {
  color: #94a3b8;
  font-size: 18px;
}

.m-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.m-card {
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  backdrop-filter: blur(10px);
}

.m-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.m-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.m-sym-group {
  display: flex;
  flex-direction: column;
}

.m-symbol {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.m-name {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.badge-green { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.badge-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.m-card-price-area {
  margin-top: auto;
  margin-bottom: 12px;
}

.m-price {
  font-size: 28px;
  font-weight: 700;
  color: white;
  display: block;
}

.m-change {
  font-size: 14px;
  font-weight: 500;
}

.text-green { color: #10b981; }
.text-red { color: #ef4444; }

.m-actions {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 12px;
}

.btn-glass {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-glass:hover { background: rgba(255,255,255,0.1); }

.btn-trade {
  background: linear-gradient(135deg, #bef264, #10b981);
  color: #022c22;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  transition: 0.2s;
}
.btn-trade:hover { filter: brightness(1.1); transform: scale(1.02); }

.loading-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #bef264;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px;
  max-width: 400px;
  margin: 40px auto;
  border-radius: 12px;
  background: #111827;
  border: 1px dashed #334155;
  color: #94a3b8;
}

.btn-retry {
  margin-top: 16px;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
`;