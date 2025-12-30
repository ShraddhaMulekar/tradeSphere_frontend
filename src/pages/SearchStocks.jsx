import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import Navbar from "../components/Navbar";

const SearchStocks = () => {
  const { query: urlQuery } = useParams(); // Read from URL
  const [searchTerm, setSearchTerm] = useState(urlQuery || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---- Fetch from backend ----
  const searchStocks = async (value) => {
    if (!value || !value.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/stock/search/${value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Robust data handling like Navbar
      const hits = data.Data || data.result || data.results || (Array.isArray(data) ? data : []);

      setResults(hits);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Initial Load (URL Param) ----
  useEffect(() => {
    if (urlQuery) {
      setSearchTerm(urlQuery);
      searchStocks(urlQuery);
    }
  }, [urlQuery]);

  // ---- Manual Search Input Handler ----
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      searchStocks(searchTerm);
    }
  };

  return (
    <div className="search-page">
      <Navbar /> {/* Ensure Navbar is present if not in layout, or just purely for context */}

      <div className="sp-container">
        <h1 className="sp-title">Search <span className="text-gradient">Results</span></h1>

        <div className="sp-search-box">
          <input
            type="text"
            placeholder="Search by company or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button onClick={() => searchStocks(searchTerm)}>🔍</button>
        </div>

        {loading ? (
          <div className="sp-msg">Searching market data...</div>
        ) : results.length > 0 ? (
          <div className="sp-grid">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="sp-card"
                onClick={() => navigate(`/stock/${item.symbol}`)}
              >
                <div className="sp-card-header">
                  <div className="sp-sym">{item.symbol}</div>
                  <div className="sp-arrow">➜</div>
                </div>
                <div className="sp-desc">{item.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sp-msg">
            {searchTerm ? "No results found." : "Enter a symbol to start searching."}
          </div>
        )}
      </div>

      <style>{css}</style>
    </div>
  );
};

export default SearchStocks;

const css = `
.search-page {
  padding-top: 80px;
  min-height: 100vh;
  background: #0a0e17;
  color: #fff;
  font-family: 'Outfit', sans-serif;
}

.sp-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.sp-title {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 30px;
}

.text-gradient {
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sp-search-box {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 40px;
  background: #1e293b;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #334155;
}

.sp-search-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
  padding: 0 10px;
}

.sp-search-box button {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}
.sp-search-box button:hover { background: #2563eb; }

.sp-msg {
  text-align: center;
  color: #94a3b8;
  font-size: 16px;
  margin-top: 40px;
}

.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.sp-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(30, 41, 59, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.sp-card:hover {
  transform: translateY(-4px);
  border-color: #60a5fa;
  background: rgba(30, 41, 59, 0.8);
}

.sp-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sp-sym {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  background: rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.sp-arrow {
  color: #60a5fa;
  font-size: 18px;
}

.sp-desc {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.4;
}
`;