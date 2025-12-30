import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.menu}>
        <div style={styles.sectionTitle}>Menu</div>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/search"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Search Stocks
        </NavLink>
        <NavLink
          to="/watchlist"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Watchlist
        </NavLink>
        <NavLink
          to="/portfolio"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/wallet"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Wallet
        </NavLink>
        <NavLink
          to="/orders"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Orders
        </NavLink>
      </div>

      <div style={styles.menu}>
        <div style={styles.sectionTitle}>Market</div>
        <NavLink
          to="/popular"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Popular
        </NavLink>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "260px",
    background: "rgba(17, 24, 39, 0.6)",
    backdropFilter: "blur(12px)",
    borderRight: "1px solid var(--border-color)",
    padding: "30px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    height: "calc(100vh - 70px)",
    position: "fixed",
    top: "70px",
    left: 0,
    overflowY: "auto",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sectionTitle: {
    padding: "0 12px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    fontWeight: "700",
    color: "var(--text-muted)",
    marginBottom: "8px",
  },
  link: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  activeLink: {
    background: "rgba(59, 130, 246, 0.1)",
    color: "var(--primary)",
    fontWeight: "600",
  }
};

export default Sidebar;