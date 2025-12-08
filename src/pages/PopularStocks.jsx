import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/api";
import BuyForm from "../components/BuyForm";

export default function PopularStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchPopularStocks();
  }, []);

  const fetchPopularStocks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/stock/popular`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStocks(data.stocks || []);
    } catch (err) {
      console.error("Error fetching popular stocks:", err);
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

  if (loading) {
    return <div className="loading">Loading popular stocks...</div>;
  }

  return (
    <div className="popular-stocks-container">
      <h2>📈 Popular Stocks</h2>
      <p className="subtitle">Quick access to trending stocks with live prices</p>

      <div className="stocks-grid">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="stock-card">
            <div className="stock-header">
              <div>
                <h3>{stock.symbol}</h3>
                <p className="stock-name">{stock.name}</p>
              </div>
              <div className="stock-price">
                <span className="price">₹{stock.price.toFixed(2)}</span>
                <span className={`change ${stock.change >= 0 ? "positive" : "negative"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="stock-actions">
              <button
                className="btn-watchlist"
                onClick={() => addToWatchlist(stock.symbol)}
              >
                + Watchlist
              </button>
              <button
                className="btn-buy"
                onClick={() => handleBuyClick(stock)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buy Form Modal */}
      {selectedStock && (
        <BuyForm
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={() => {
            alert("Buy successful from popular stocks");
          }}
        />
      )}

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */
const css = `
.popular-stocks-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.popular-stocks-container h2 {
  font-size: 28px;
  margin-bottom: 8px;
  color: #1e293b;
  text-align: center;
}

.subtitle {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 14px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #64748b;
}

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.stock-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stock-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stock-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 4px 0;
}

.stock-name {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.stock-price {
  text-align: right;
}

.price {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.change.positive {
  color: #16a34a;
  background: #dcfce7;
}

.change.negative {
  color: #dc2626;
  background: #fee2e2;
}

.stock-actions {
  display: flex;
  gap: 8px;
}

.stock-actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-watchlist {
  background: #f1f5f9;
  color: #475569;
}

.btn-watchlist:hover {
  background: #e2e8f0;
}

.btn-buy {
  background: #16a34a;
  color: white;
}

.btn-buy:hover {
  background: #15803d;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 1024px) {
  .stocks-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .popular-stocks-container {
    padding: 15px;
  }

  .popular-stocks-container h2 {
    font-size: 24px;
  }

  .stocks-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }

  .stock-card {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .stocks-grid {
    grid-template-columns: 1fr;
  }

  .stock-header {
    flex-direction: column;
    gap: 12px;
  }

  .stock-price {
    text-align: left;
  }

  .stock-actions {
    flex-direction: column;
  }

  .stock-actions button {
    width: 100%;
    padding: 12px;
  }
}
`;