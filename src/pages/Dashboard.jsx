import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { usePortfolio } from "../context/PortfolioContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();

  // Mock Transactions removed - fetching real data
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/order/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.orders) {
          // Sort by date desc (assuming API might not) and take 2
          const sorted = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecentTransactions(sorted.slice(0, 2));
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTransactions();
  }, []);

  // --- Calculations ---
  const totalInvestment = portfolio.reduce((acc, item) => {
    return acc + (Number(item.buyPrice || 0) * Number(item.quantity || 0));
  }, 0);

  const totalCurrentValue = portfolio.reduce((acc, item) => {
    return acc + (Number(item.currentPrice || 0) * Number(item.quantity || 0));
  }, 0);

  const totalPnl = totalCurrentValue - totalInvestment;

  // Sort by value desc, take top 2 for list
  const topAssets = [...portfolio]
    .map(p => ({
      ...p,
      value: (Number(p.currentPrice || 0) * Number(p.quantity || 0))
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <div className="nexanza-dash-container">
        <div className="nexanza-dash">

          {/* 1. OVERVIEW SECTION (Top Left) - REVERTED TO GREEN CARD STYLE */}
          <div className="card overview-card">
            <div className="card-header">
              <span className="card-title" style={{ color: '#000' }}>Overview</span>
            </div>

            <div className="balance-display">
              <span className="balance-label">Current Value</span>
              <h1>₹{totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h1>
            </div>

            <div className="overview-stats-grid">
              <div className="stat-item">
                <span className="stat-lbl">Investment</span>
                <span className="stat-val">₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="stat-item">
                <span className="stat-lbl">Total Profit/Loss</span>
                <span className="stat-val">
                  {totalPnl >= 0 ? "+" : ""}₹{Math.abs(totalPnl).toFixed(2)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-lbl">Total Stocks</span>
                <span className="stat-val">{portfolio.length}</span>
              </div>
            </div>

            <div className="overview-footer">
              <div className="usdt-val">
                Net P&L <span className="p-badge">{((totalPnl / totalInvestment) * 100 || 0).toFixed(2)}%</span>
              </div>
              <button className="btn-buy-sm">Details ›</button>
            </div>
          </div>

          {/* 2. PORTFOLIO SECTION (Top Right) */}
          <div className="card portfolio-card">
            <div className="card-header">
              <span className="card-title">My Portfolio</span>
            </div>

            <div className="portfolio-list">
              {topAssets.length === 0 ? (
                <div style={{ color: "#6b7280", fontSize: "12px", textAlign: 'center', padding: '20px' }}>
                  No assets found. Start trading!
                </div>
              ) : (
                topAssets.map((asset, i) => (
                  <div key={asset.symbol} className="asset-row">
                    <div className={`asset-icon icon-${i % 4}`}>
                      {asset.symbol[0]}
                    </div>
                    <div className="asset-details">
                      <b className="asset-sym">{asset.symbol}</b>
                      <span className="asset-qty">Qty: {asset.quantity}</span>
                    </div>
                    <div className="asset-price">
                      ₹{Number(asset.currentPrice).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
              <button className="btn-see-all" onClick={() => navigate('/portfolio')}>
                See all ›
              </button>
            </div>
          </div>

          {/* 3. CHART SECTION (Bottom Left) */}
          <div className="card chart-card">
            <div className="card-header">
              <span className="card-title">Market Overview</span>
            </div>
            <div className="chart-visual">
              <svg viewBox="0 0 300 100" className="dummy-chart">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#bef264" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 80 C 40 80, 40 40, 80 40 C 120 40, 120 70, 160 70 C 200 70, 200 20, 240 20 C 270 20, 280 50, 300 50 V 100 H 0 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0 80 C 40 80, 40 40, 80 40 C 120 40, 120 70, 160 70 C 200 70, 200 20, 240 20 C 270 20, 280 50, 300 50"
                  fill="none"
                  stroke="#bef264"
                  strokeWidth="2"
                />
              </svg>
              <div className="chart-labels">
                <span>10:00</span>
                <span>11:00</span>
                <span>12:00</span>
                <span>13:00</span>
                <span>14:00</span>
              </div>
            </div>
          </div>

          {/* 4. TRANSACTIONS (Bottom Right) */}
          <div className="card transactions-card">
            <div className="card-header">
              <span className="card-title">Recent Transactions</span>
            </div>
            <div className="t-list">
              {recentTransactions.length === 0 ? (
                <div style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", padding: "10px" }}>
                  No recent activity
                </div>
              ) : (
                recentTransactions.map(t => (
                  <div key={t._id} className="t-row">
                    <div className={`t-icon ${t.type === "BUY" ? 'receive' : 'send'}`}>
                      {t.type === "BUY" ? '↑' : '↓'}
                    </div>
                    <div className="t-details">
                      {/* STOCK NAME instead of 0.02 BTC... */}
                      <div className="t-amount" style={{ fontWeight: '700' }}>{t.symbol}</div>
                      <div className="t-sub">
                        {t.type === "BUY" ? 'Buy Order' : 'Sell Order'} • {t.quantity} Qty
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button className="btn-see-all" onClick={() => navigate('/orders')}>
                See all transactions ›
              </button>
            </div>
          </div>

        </div>
        <style>{css}</style>
      </div>
    </>
  );
}

const css = `
.nexanza-dash-container {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17;
  display: flex;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
}

.nexanza-dash {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr; 
  grid-template-areas: 
    "overview portfolio"
    "chart transactions";
  gap: 24px;
  padding: 24px;
  width: 100%;
  max-width: 1400px;
  color: #fff;
}

@media (max-width: 1024px) {
  .nexanza-dash {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "overview"
      "portfolio"
      "chart"
      "transactions";
  }
}

.card {
  background: #111827;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #1f2937;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

/* OVERVIEW (Green Card Reverted) */
.overview-card {
  grid-area: overview;
  background: linear-gradient(135deg, #d9f99d 0%, #bef264 100%);
  color: #000;
  border: none;
  justify-content: space-between;
}

.balance-display { margin-bottom: 20px; }
.balance-display h1 { font-size: 36px; font-weight: 800; margin: 0; letter-spacing: -1px; }
.balance-label { font-size: 13px; opacity: 0.7; font-weight: 600; text-transform: uppercase; }

.overview-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item { display: flex; flex-direction: column; }
.stat-lbl { font-size: 11px; opacity: 0.6; font-weight: 600; text-transform: uppercase; }
.stat-val { font-size: 15px; font-weight: 700; }

.overview-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.8);
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
}
.usdt-val { font-size: 13px; font-weight: 500; }
.p-badge { color: #bef264; font-size: 11px; margin-left: 8px; font-weight: 700; }

.btn-buy-sm {
  background: #374151;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  cursor: pointer;
}

/* PORTFOLIO */
.portfolio-card { grid-area: portfolio; height: 82%; }

.btn-text {
  background: rgba(255,255,255,0.05);
  border: none;
  color: #94a3b8;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-text:hover { color: white; background: rgba(255,255,255,0.1); }

/* LIST COMPACTION */
.portfolio-list, .t-list {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Reduced gap */
}

.asset-row, .t-row {
  display: flex;
  align-items: center;
  padding: 10px; /* Reduced padding */
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  transition: 0.2s;
}
.asset-row:hover { background: rgba(255,255,255,0.05); }

.asset-icon, .t-icon {
  width: 36px; height: 36px; /* Slightly smaller icons */
  min-width: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-right: 12px;
  font-weight: 700; color: white;
  font-size: 16px;
}
.icon-0 { background: #f59e0b; }
.icon-1 { background: #3b82f6; }
.icon-2 { background: #10b981; }
.icon-3 { background: #ef4444; }

.asset-details { flex: 1; display: flex; flex-direction: column; }
.asset-sym { font-size: 15px; color: white; }
.asset-qty { font-size: 12px; color: #94a3b8; }

.asset-price { font-size: 15px; font-weight: 600; color: #bef264; }

/* CHART */
.chart-card { 
  grid-area: chart; 
  min-height: 300px; 
}
.chart-visual {
  flex: 1;
  background: #000;
  border-radius: 12px;
  position: relative;
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
}
.dummy-chart {
  width: 100%;
  height: 100%;
}
.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 10px;
  color: #6b7280;
}

/* TRANSACTIONS */
.transactions-card { grid-area: transactions; }

.t-list { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
.t-row { display: flex; align-items: center; gap: 12px; }

.t-icon { 
  width: 32px; 
  height: 32px; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}
.t-icon.receive { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.t-icon.send { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.t-details { flex: 1; display: flex; flex-direction: column; }
.t-amount { font-size: 14px; color: white; font-weight: 500; }
.t-sub { font-size: 12px; color: #94a3b8; }

.btn-see-all {
  margin-top: auto;
  background: #1f2937;
  color: #94a3b8;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-see-all:hover { background: #374151; color: white; }
`;