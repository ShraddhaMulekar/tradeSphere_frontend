import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        {/* LEFT: LOGO */}
        <div className="nav-brand" onClick={() => navigate("/dashboard")}>
          <div className="logo-box">
            <div className="logo-glint"><img src='/assets/image.png ' alt="logo" /></div>
          </div>
          <span className="brand-text">TradeSphere</span>
        </div>

        {/* MIDDLE: SEARCH BAR */}
        <div className="nav-search desktop-only">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* MIDDLE-RIGHT: LINKS */}
        <div className="nav-links desktop-only">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Dashboard
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Portfolio
          </NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Watchlist
          </NavLink>
          <NavLink to="/popular" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Markets
          </NavLink>
          <NavLink to="/wallet" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Wallet
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Orders
          </NavLink>
        </div>

        {/* RIGHT: USER INFO */}
        <div className="nav-user">
          {user ? (
            <div className="user-section">
              <span className="welcome-text desktop-only">
                Welcome, <span className="u-name">{user.name}</span>
              </span>
              <div className="avatar-circle">
                {user.name ? { userName } : "U"}
              </div>
              <button onClick={logout} className="btn-logout" title="Logout">⏻</button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="btn-login">Login</button>
          )}

          {/* MOBILE TOGGLE */}
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass-panel">
          <div className="mobile-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/portfolio" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</NavLink>
          <NavLink to="/watchlist" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</NavLink>
          <NavLink to="/popular" onClick={() => setIsMobileMenuOpen(false)}>Markets</NavLink>
          <NavLink to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Transaction</NavLink>
        </div>
      )}

      <style>{css}</style>
    </nav>
  );
};

const css = `
.navbar {
  height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: rgba(10, 14, 23, 0.9);
  backdrop-filter: blur(12px);
  background: rgba(10, 14, 23, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: center;
}

.nav-container {
  width: 100%;
  max-width: 1600px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
}

/* BRAND */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-box {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981, #059669); /* Greenish like reference */
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.logo-glint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%);
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

/* SEARCH */
.nav-search {
  flex: 1;
  max-width: 300px;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(10, 14, 23, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(4, 36, 15, 0.9);
}

.nav-search input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.search-icon {
  font-size: 14px;
  opacity: 0.7;
}

/* LINKS */
.nav-links {
  display: flex;
  gap: 4px;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: white;
  background: rgba(255,255,255,0.05);
}

.nav-item.active {
  color: #10b981; /* Neon green accent */
  background: rgba(16, 185, 129, 0.1);
  font-weight: 600;
}

/* USER */
.nav-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1e293b;
  padding: 6px 16px;
  border-radius: 30px;
  border: 1px solid #334155;
}

.welcome-text {
  font-size: 12px;
  color: #94a3b8;
}

.u-name {
  color: white;
  font-weight: 600;
}

.avatar-circle {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.btn-logout {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
}

.btn-login {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

/* MOBILE MENU */
.mobile-menu {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  background: #0a0e17;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.mobile-search {
  background: #1e293b;
  padding: 10px;
  border-radius: 8px;
}
.mobile-search input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  outline: none;
}

.mobile-menu a {
  color: #cbd5e1;
  text-decoration: none;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  text-align: center;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .desktop-only {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .user-section {
    background: transparent;
    border: none;
    padding: 0;
  }
}
`;

export default Navbar;