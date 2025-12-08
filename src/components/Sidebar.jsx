import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <NavLink to="/dashboard" style={styles.link}>Dashboard</NavLink>
      <NavLink to="/search" style={styles.link}>Search Stocks</NavLink>
      <NavLink to="/watchlist" style={styles.link}>Watchlist</NavLink>
      <NavLink to="/portfolio" style={styles.link}>Portfolio</NavLink>
      <NavLink to="/news" style={styles.link}>News</NavLink>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "200px",
    background: "#1f2937",
    minHeight: "calc(100vh - 60px)",
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px 20px",
    fontSize: "16px"
  }
};

export default Sidebar;