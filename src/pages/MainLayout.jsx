import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function MainLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const styles = {
    navbar: {
      width: "100%",
      background: "#111",
      padding: "12px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
      color: "white",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
    },
    logoutBtn: {
      background: "red",
      color: "white",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      border: "none",
    },
    content: {
      padding: "20px",
    },
  };

  return (
    <div>
      {/* NAVBAR ALWAYS VISIBLE */}
      <nav style={styles.navbar}>
        <h2 style={{ margin: 0 }}>TradeSphere</h2>

        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/search" style={styles.link}>Search</Link>
          <Link to="/watchlist" style={styles.link}>Watchlist</Link>
          <Link to="/portfolio" style={styles.link}>Portfolio</Link>
          <Link to="/wallet" style={styles.link}>Wallet</Link>
          <Link to="/orders" style={styles.link}>Orders</Link>

          <button
            style={styles.logoutBtn}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* IMPORTANT: All Pages Render Here */}
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
