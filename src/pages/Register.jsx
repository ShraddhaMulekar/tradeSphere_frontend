import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (!name || !email || !password) {
      setMsg("All fields are required!");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setMsg(data.message || "Registration failed!");
        setIsError(true);
        return;
      }

      setMsg("Success! Redirecting to Login...");
      setIsError(false);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMsg("An error occurred. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* LEFT SIDE - HERO */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Journey <br />Starts Here.</h1>
          <p className="hero-subtitle">
            Create your account today and get access to premium market insights, real-time alerts, and more.
          </p>
          <div className="hero-features">
            <div className="feature">✓ Real-time Market Data</div>
            <div className="feature">✓ Advanced Charting Tools</div>
            <div className="feature">✓ Secure & Encrypted</div>
          </div>
        </div>
        <div className="chart-overlay"></div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Join thousands of successful traders.</p>
          </div>

          {msg && (
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid",
                fontSize: "14px",
                marginBottom: "24px",
                background: isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                borderColor: isError ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                color: isError ? "#ef4444" : "#10b981"
              }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={handleRegister} className="register-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="u@example.com"
                type="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                type="password"
                required
              />
            </div>

            <button
              className="btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="footer">
            <p className="footer-text">
              Already have an account?{" "}
              <span className="link" onClick={() => navigate("/login")}>
                Sign In
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
.register-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #0a0e17;
  overflow: hidden;
}

.hero-section {
  flex: 1.2;
  background: linear-gradient(135deg, #059669 0%, #064e3b 100%);
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
  background: linear-gradient(to right, #fff, #a7f3d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: #d1fae5;
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.chart-overlay {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%);
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  border-color: #10b981;
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
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
  color: #10b981;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}

/* Responsive */
@media (max-width: 900px) {
  .register-container {
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
