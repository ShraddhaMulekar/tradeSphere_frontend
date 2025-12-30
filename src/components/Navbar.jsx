import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import FullLogo from "../assets/FullLogo.png"; // Import the logo

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to get first name from userName
  const getUserName = () => {
    if (!user) return "Trader";
    // Using userName property as per user request/logs. 
    // Fallback to name if userName is missing, or "Trader" if both missing
    return user.userName || user.name || "Trader";
  };

  const displayName = getUserName();
  const displayInitial = displayName ? displayName[0].toUpperCase() : "U";

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LEFT: LOGO */}
        <div className="nav-brand" onClick={() => navigate("/dashboard")}>
          <div className="logo-box">
            {/* Use imported FullLogo */}
            <img src={FullLogo} alt="TradeSphere Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="brand-text">TradeSphere</span>
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
                Welcome <span className="u-name">{displayName}</span>
              </span>
              <div className="avatar-circle">
                {displayInitial}
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
  z-index: 9999;
  background: rgba(10, 14, 23, 0.95); /* Slightly less transp for readability */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  width: 98.7%;
}

.nav-container {
  width: 100%;
  max-width: 1600px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  box-sizing: border-box; /* Ensure padding doesn't overflow width */
}

/* BRAND */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

/* Adjusted logo box for Custom Logo */
.logo-box {
  width: 40px; /* Slightly larger for full logo visibility */
  height: 40px;
  /* Removed background gradient so transparency works */
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

/* LINKS */
.nav-links {
  display: flex;
  gap: 4px;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
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

.u-name { color: white; font-weight: 600; }

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
  z-index: 9998;
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