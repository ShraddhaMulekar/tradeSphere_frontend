import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    // Validate fields BEFORE making API call
    if (!name || !email || !password) {
      setMsg("All fields are required!");
      setIsError(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Registration failed!");
        setIsError(true);
        return;
      }

      setMsg("Registered Successfully! Redirecting to Login...");
      setIsError(false);
      setTimeout(() => handleNavigate("/login"), 1500);
    } catch (error) {
      setMsg("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {msg && <p style={{ ...styles.message, color: isError ? "#eb3824" : "#27ae60" }}>{msg}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            style={styles.input}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            type="email"
            style={styles.input}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            style={styles.input}
          />

          <button style={styles.registerBtn}>Register</button>
        </form>

        <button style={styles.loginBtn} onClick={() => handleNavigate("/login")}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef1f7",
    padding: "20px",
  },

  card: {
    width: "360px",
    padding: "32px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    marginBottom: "18px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#333",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },

  registerBtn: {
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    fontWeight: "500",
  },

  loginBtn: {
    marginTop: "18px",
    padding: "10px",
    background: "transparent",
    border: "1px solid #4f46e5",
    color: "#4f46e5",
    borderRadius: "8px",
    cursor: "pointer",
  },

  message: {
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "500",
  },
};