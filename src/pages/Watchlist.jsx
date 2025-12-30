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
          console.log("Search Response:", data); // Debugging

          // Handle various possible backend response structures
          const results = data.Data || data.result || (Array.isArray(data) ? data : []);

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
          setShowSuggestions(true); // Show dropdown with error/empty
        }
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [symbol]);

  const selectSuggestion = (s) => {
    setSymbol(s.symbol);       // Set the input to the symbol
    setShowSuggestions(false); // Hide dropdown
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
    // Ensure we don't add duplicates if possible logic exists in hook, or just rely on backend
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
    <div className="watchlist-page" style={{ paddingTop: "80px", minHeight: "100vh", background: "#0a0e17", color: "white" }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>My Watchlist</h2>

        <div style={styles.addSection}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              placeholder="Search Company/Symbol (e.g. Apple)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={styles.searchInput}
              onFocus={() => symbol.length > 1 && setShowSuggestions(true)}
              // Delay blur to allow click on suggestion
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {/* SUGGESTIONS DROPDOWN */}
            {showSuggestions && (
              <div style={styles.suggestionsDropdown}>
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      style={styles.suggestionItem}
                      onMouseDown={() => selectSuggestion(item)}
                    >
                      <span style={{ fontWeight: "bold", color: "#bef264" }}>{item.symbol}</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "10px" }}>
                        {item.description}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "12px", color: "#94a3b8", fontSize: "14px", fontStyle: "italic" }}>
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleAdd} className="btn-primary" style={styles.addBtn}>
            + Add Stock
          </button>
        </div>

        {watchlist.length === 0 && (
          <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            Your watchlist is empty. Add stocks to track them here.
          </div>
        )}

        <div style={styles.grid}>
          {watchlist.map((item) => {
            const cp = prices[item];
            const isAvailable = cp !== undefined && cp !== null;

            return (
              <div className="glass-panel" style={styles.card} key={item}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.symbol}>{item}</h3>
                  <div style={styles.priceTag}>
                    {loadingPrices ? "Loading..." : isAvailable ? `₹${cp.toFixed(2)}` : "N/A"}
                  </div>
                </div>

                <div style={styles.actions}>
                  <button
                    className="btn-primary"
                    style={styles.buyBtn}
                    disabled={!isAvailable}
                    onClick={() => handleBuyClick(item, cp)}
                  >
                    Buy Now
                  </button>

                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromWatchlist(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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
      <style>{`
        .glass-panel {
          background: #111827; 
          border: 1px solid #1f2937;
          border-radius: 12px;
        }
        .btn-primary {
           background: #10b981;
           color: white;
           border: none;
           padding: 10px 16px;
           border-radius: 8px;
           cursor: pointer;
           font-weight: 600;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 24px"
  },
  title: {
    fontSize: "32px",
    marginBottom: "24px",
    color: "white",
    fontWeight: "700"
  },
  addSection: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    maxWidth: "600px",
    position: "relative", // context for z-index if needed
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    outline: "none",
  },
  addBtn: {
    whiteSpace: "nowrap",
  },
  suggestionsDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    marginTop: "4px",
    zIndex: 9999, // Max z-index
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
  },
  suggestionItem: {
    padding: "10px 16px",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  symbol: {
    fontSize: "20px",
    fontWeight: "700",
    color: "white",
    margin: 0,
  },
  priceTag: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#bef264",
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  buyBtn: {
    width: "100%",
    fontSize: "14px",
    padding: "10px",
  },
  removeBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.2s",
    padding: "10px"
  }
};