import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <h2 style={{ color: "white" }}>TradeSphere</h2>

      <div style={styles.links}>
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <span style={{ color: "white", marginRight: "15px" }}>
              {user?.name}
            </span>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px"
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px"
  },
  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Navbar;