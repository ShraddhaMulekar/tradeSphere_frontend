import React, { useEffect, useState } from "react";
import { useWatchlist } from "../hooks/useWatchlist";
import { API_BASE_URL } from "../api/api";
import BuyForm from "../components/BuyForm";
import Navbar from "../components/Navbar";

export default function Watchlist() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const [symbol, setSymbol] = useState("");
  const [searchResults, setSearchResults] = useState([]); // For autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [prices, setPrices] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);

  // --- SEARCH AUTOCOMPLETE ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (symbol.length > 1) {
        try {
          const token = localStorage.getItem("token");
          // Use the search API endpoint
          const res = await fetch(`${API_BASE_URL}/stock/search/${symbol}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();

          // Handle various possible backend response structures
          const results = data.Data || data.results || (Array.isArray(data) ? data : []);

          if (results && results.length > 0) {
            setSearchResults(results);
            setShowSuggestions(true);
          } else {
            setSearchResults([]);
            setShowSuggestions(true); // Keep open to show "No results"
          }
        } catch (err) {
          console.error("Search error", err);
          setSearchResults([]);
          setShowSuggestions(true);
        }
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [symbol]);

  const selectSuggestion = (s) => {
    setSymbol(s.symbol);
    setShowSuggestions(false);
  };

  /* ================= FETCH PRICE ================= */
  const fetchPrice = async (symbol) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${API_BASE_URL}/stock/quote/${symbol}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.price ?? null;
    } catch (err) {
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
    setShowSuggestions(false);
  };

  /* ================= OPEN BUY FORM ================= */
  const handleBuyClick = (item, price) => {
    setSelectedStock({
      symbol: item,
      currentPrice: price,
    });
  };

  return (
    <div className="watchlist-page">
      <Navbar />
      <div className="w-container">

        <div className="w-header">
          <h1 className="w-title">My <span className="text-gradient">Watchlist</span></h1>
          <p className="w-subtitle">Track your favorite assets in real-time</p>
        </div>

        <div className="add-section">
          <div className="search-wrapper">
            <input
              placeholder="Search Company/Symbol (e.g. Apple)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-search-input"
              onFocus={() => symbol.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {/* SUGGESTIONS DROPDOWN */}
            {showSuggestions && (
              <div className="suggestions-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onMouseDown={() => selectSuggestion(item)}
                    >
                      <span className="s-symbol">{item.symbol}</span>
                      <span className="s-desc">{item.description}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleAdd} className="btn-add-stock">
            + Add
          </button>
        </div>

        {watchlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Your watchlist is empty</h3>
            <p>Search for stocks above to start tracking them.</p>
          </div>
        ) : (
          <div className="w-grid">
            {watchlist.map((item) => {
              const cp = prices[item];
              const isAvailable = cp !== undefined && cp !== null;

              return (
                <div className="w-card" key={item}>
                  <div className="w-card-header">
                    <h3 className="w-symbol">{item}</h3>
                    <div className="w-price">
                      {loadingPrices ? "..." : isAvailable ? `₹${cp.toFixed(2)}` : "N/A"}
                    </div>
                  </div>

                  <div className="w-card-actions">
                    <button
                      className="btn-w-buy"
                      disabled={!isAvailable}
                      onClick={() => handleBuyClick(item, cp)}
                    >
                      Buy Now
                    </button>

                    <button
                      className="btn-w-remove"
                      onClick={() => removeFromWatchlist(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
.watchlist-page {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

.w-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
}

.w-header {
  text-align: center;
  margin-bottom: 40px;
}

.w-title {
  font-size: 42px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.text-gradient {
  background: linear-gradient(to right, #0ea5e9, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.w-subtitle {
  color: #94a3b8;
  font-size: 18px;
}

/* Search Section */
.add-section {
  display: flex;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
  z-index: 10;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.w-search-input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #334155;
  background: #1e293b;
  color: white;
  font-size: 16px;
  outline: none;
  transition: 0.3s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.w-search-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.btn-add-stock {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border: none;
  padding: 0 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.btn-add-stock:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  margin-top: 8px;
  z-index: 9999;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: rgba(14, 165, 233, 0.1);
}

.s-symbol {
  font-weight: 700;
  color: #38bdf8;
}

.s-desc {
  font-size: 12px;
  color: #94a3b8;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
}

/* Grid */
.w-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  perspective: 1000px;
}

.w-card {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4));
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s, border-color 0.3s;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.w-card:hover {
  transform: translateY(-5px);
  border-color: #38bdf8;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.w-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.w-symbol {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.w-price {
  font-size: 20px;
  font-weight: 600;
  color: #38bdf8;
}

.w-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-w-buy {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-w-buy:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.2);
}
.btn-w-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-w-remove {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-w-remove:hover {
  background: rgba(239, 68, 68, 0.2);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 20px;
  border: 2px dashed #334155;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
`;