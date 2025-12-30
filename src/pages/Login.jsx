import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      login(data.token);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE - HERO */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Trade Smarter, <br />Not Harder.</h1>
          <p className="hero-subtitle">
            Join the fastest growing trading platform. Real-time data, advanced analytics, and zero commission.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <h3>10M+</h3>
              <span>Users</span>
            </div>
            <div className="stat">
              <h3>$5B+</h3>
              <span>Volume</span>
            </div>
          </div>
        </div>

        {/* Abstract Chart Graphic/Background Overlay */}
        <div className="chart-overlay"></div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Please enter your details to sign in.</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="u@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="footer">
            <p className="footer-text">
              Don't have an account?{" "}
              <span className="link" onClick={() => navigate("/register")}>
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #0a0e17;
  overflow: hidden;
}

.hero-section {
  flex: 1.2;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  color: white;
  overflow: hidden;
}

.hero-content {
  max-width: 500px;
  z-index: 2;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(to right, #fff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat h3 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  color: white;
}

.stat span {
  color: #94a3b8;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.chart-overlay {
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%);
  z-index: 1;
}

/* FORM SIDE */
.form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0a0e17;
  padding: 40px;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: 32px;
  text-align: left;
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 16px;
  color: #94a3b8;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: #cbd5e1;
}

.input-group input {
  padding: 16px;
  border-radius: 12px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: #3b82f6;
}

.error-alert {
  padding: 12px;
  border-radius: 8px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 20px;
}

.submit-btn {
  margin-top: 10px;
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  color: #94a3b8;
  font-size: 14px;
}

.link {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}

/* Responsive */
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  
  .hero-section {
    padding: 40px 20px;
    flex: none;
  }

  .hero-title {
    font-size: 36px;
  }
  
  .form-section {
    padding: 40px 20px;
    flex: 1;
  }
}
`;
