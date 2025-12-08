import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  /* 🔍 SEARCH STOCKS */
  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;
    if (!searchQuery.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/stock/search/${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  /* ➕ ADD TO WATCHLIST */
  const addToWatchlist = async (item) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/watchlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: item.symbol,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add to watchlist");
        return;
      }

      alert(`${item.symbol} added to watchlist!`);
      navigate("/watchlist");
      setResults([]);
      setSearchQuery("");
    } catch (err) {
      console.error("Add to watchlist error:", err);
      alert("Failed to add to watchlist");
    }
  };

  return (
    <>
      <nav className="dash-nav">
        <div className="nav-left">
          <h2 className="logo">TradeSphere</h2>
        </div>

        {/* Hamburger Menu */}
        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop Navigation */}
        <div className={`nav-center ${mobileMenuOpen ? "mobile-active" : ""}`}>
          <Link to="/popular" onClick={() => setMobileMenuOpen(false)}>
            Popular Stocks
          </Link>
          <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)}>
            Watchlist
          </Link>
          <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)}>
            Portfolio
          </Link>
          <Link to="/wallet" onClick={() => setMobileMenuOpen(false)}>
            Wallet
          </Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
            Orders
          </Link>
        </div>

        <div className="nav-right">
          <input
            type="text"
            placeholder="Search Stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <LogoutButton />
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* ================= SEARCH RESULTS ================= */}
      {results.length > 0 && (
        <div className="search-results">
          {results.map((item) => (
            <div
              className="search-item"
              key={item.symbol}
              onClick={() => addToWatchlist(item)}
            >
              <strong>{item.symbol}</strong>
              <span>{item.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      {user && (
        <div className="welcome-banner">
          <span className="welcome-text">Welcome, {user.userName}! 😊</span>
        </div>
      )}

      <div className="dashboard-content">
        <h1>Welcome to TradeSphere Dashboard</h1>
        <p>Use the navigation above to access different features.</p>

        <div className="quick-actions">
          <Link to="/watchlist" className="action-card">
            <h3>📊 Watchlist</h3>
            <p>View and manage your watchlist</p>
          </Link>

          <Link to="/portfolio" className="action-card">
            <h3>💼 Portfolio</h3>
            <p>Check your holdings</p>
          </Link>

          <Link to="/wallet" className="action-card">
            <h3>💰 Wallet</h3>
            <p>Manage your funds</p>
          </Link>

          <Link to="/orders" className="action-card">
            <h3>📦 Orders</h3>
            <p>View order history</p>
          </Link>
        </div>
      </div>

      <style>{css}</style>
    </>
  );
}

/* ================= CSS ================= */
const css = `
.dash-nav {
  width: 95%;
  height: 70px;
  background: #0b0f19;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo { 
  font-size: 24px; 
  font-weight: 700;
  margin: 0;
}

/* Hamburger Menu */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 101;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

.nav-center { 
  display: flex; 
  gap: 20px; 
  align-items: center;
}

.nav-center a { 
  color: #d1d1d1; 
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-center a:hover { 
  color: #fff; 
}

.nav-right { 
  display: flex; 
  gap: 12px; 
  align-items: center;
}

.search-input { 
  padding: 8px 14px; 
  border-radius: 6px; 
  width: 220px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.search-results {
  position: absolute;
  top: 75px;
  right: 120px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
}

.search-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.search-item:hover { 
  background: #f0f9ff; 
}

.search-item strong { 
  display: block; 
  font-size: 16px;
  color: #1e40af;
  margin-bottom: 4px;
}

.search-item span { 
  font-size: 13px; 
  color: #666; 
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10px;
  text-align: center;
  margin: 20px;
}

.welcome-text {
  color: white;
  font-weight: bold;
  font-size: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-content {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.dashboard-content h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #1e293b;
}

.dashboard-content > p {
  color: #64748b;
  margin-bottom: 40px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.action-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.action-card h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.action-card p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.action-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.action-card:nth-child(4) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.mobile-overlay {
  display: none;
}

/* ================= RESPONSIVE ================= */

/* Tablet */
@media (max-width: 1024px) {
  .dash-nav {
    padding: 0 20px;
  }

  .nav-center {
    gap: 15px;
  }

  .nav-center a {
    font-size: 14px;
  }

  .search-input {
    width: 180px;
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .dash-nav {
    padding: 0 15px;
  }

  .hamburger {
    display: flex;
  }

  .nav-center {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 70%;
    height: calc(100vh - 70px);
    background: #1a1f2e;
    flex-direction: column;
    align-items: flex-start;
    padding: 30px 20px;
    gap: 25px;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0,0,0,0.3);
  }

  .nav-center.mobile-active {
    left: 0;
  }

  .nav-center a {
    font-size: 18px;
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
  }

  .nav-right {
    gap: 8px;
  }

  .search-input {
    width: 120px;
    padding: 6px 10px;
    font-size: 12px;
  }

  .search-results {
    right: 15px;
    width: calc(100% - 30px);
    max-width: 320px;
  }

  .welcome-text {
    font-size: 16px;
  }

  .dashboard-content h1 {
    font-size: 24px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .action-card {
    padding: 25px;
  }

  .action-card h3 {
    font-size: 20px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .logo {
    font-size: 18px;
  }

  .search-input {
    width: 100px;
  }

  .nav-center {
    width: 80%;
  }

  .dashboard-content {
    padding: 15px;
    margin: 20px auto;
  }

  .welcome-banner {
    padding: 15px;
  }

  .welcome-text {
    font-size: 14px;
  }
}
`;
