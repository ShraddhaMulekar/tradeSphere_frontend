import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

const SearchStocks = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // ---- Fetch from backend ----
  const searchStocks = async (value) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/stock/search/${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // FINNHUB backend sends -> Data: data.result
      if (data.Data) {
        setResults(data.Data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  // ---- Debounce ----
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) searchStocks(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={styles.container}>
      <h2>Search Stocks</h2>

      <input
        type="text"
        placeholder="Search by company or symbol…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />

      {/* Search Results */}
      <div style={styles.list}>
        {results.map((item, idx) => (
          <div
            key={idx}
            style={styles.item}
            onClick={() => navigate(`/stock/${item.symbol}`)} // <-- FIXED
          >
            <strong>${item.symbol}</strong> — {item.description}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Styles ----
const styles = {
  container: {
    padding: "20px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: {
    padding: "12px",
    background: "#f3f4f6",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default SearchStocks;