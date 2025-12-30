import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useWatchlist } from "../hooks/useWatchlist";
import { usePortfolio } from "../context/PortfolioContext";
import Navbar from "../components/Navbar"; // Explicit import

export default function Dashboard() {
  const { user } = useAuth();
  const { watchlist } = useWatchlist();
  const { portfolio } = usePortfolio();

  // Mock Transactions (keep as mock for now, but ensure structure is clean)
  const transactions = [
    { id: 1, type: "receive", asset: "BTC", amount: "0.0200009", time: "15:23", from: "543643" },
    { id: 2, type: "send", asset: "USDT", amount: "500.00", time: "12:23", to: "998877" },
    { id: 3, type: "send", asset: "ETH", amount: "1.5000", time: "09:28", to: "112233" }
  ];

  // 1. Calculate Totals
  const totalBalance = portfolio.reduce((acc, item) => {
    return acc + (Number(item.currentPrice || 0) * Number(item.quantity || 0));
  }, 0);

  // 2. Calculate Distribution for Dynamic Rendering
  // Sort by value desc, take top 3
  const sortedAssets = [...portfolio]
    .map(p => ({
      ...p,
      value: (Number(p.currentPrice || 0) * Number(p.quantity || 0))
    }))
    .sort((a, b) => b.value - a.value);

  const topAssets = sortedAssets.slice(0, 3);
  const totalVal = sortedAssets.reduce((sum, item) => sum + item.value, 0) || 1; // avoid div by 0

  return (
    <>
      <Navbar />
      <div className="nexanza-dash-container">
        <div className="nexanza-dash">

          {/* 1. OVERVIEW CARD (Top Left) */}
          <div className="card overview-card">
            <div className="card-header">
              <span className="card-title">Overview</span>
            </div>

            <div className="overview-stats">
              <div className="stat-box">
                <span className="stat-val">150</span>
                <span className="stat-label">Transactions</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{portfolio.length}</span>
                <span className="stat-label">Wallets</span>
              </div>
            </div>

            <div className="balance-display">
              <h1>${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
              <span className="balance-label">Current balance</span>
            </div>

            <div className="overview-footer">
              <div className="usdt-val">
                ≈ {totalBalance.toFixed(0)} USD <span className="p-badge">▲ 2.4%</span>
              </div>
              <button className="btn-buy-sm">Buy ›</button>
            </div>
          </div>

          {/* 2. PORTFOLIO SECTION (Top Right) */}
          <div className="card portfolio-card">
            <div className="card-header">
              <span className="card-title">My portfolio</span>
              <button className="btn-text">Go to Portfolio ›</button>
            </div>

            {/* Dynamic Asset List */}
            <div className="portfolio-assets">
              {topAssets.length === 0 ? (
                <div style={{ color: "#6b7280", fontSize: "12px" }}>No assets found. Start trading!</div>
              ) : (
                topAssets.map((asset, i) => (
                  <div key={asset.symbol} className={`asset-pill pill-${i}`}>
                    <div className="p-icon">{asset.symbol[0]}</div>
                    <div className="p-info">
                      <b>{asset.symbol}</b>
                      <span>${asset.currentPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Dynamic Distribution Bar */}
            <div className="assets-distribution">
              <div className="dist-bar">
                {topAssets.map((asset, i) => (
                  <div
                    key={asset.symbol}
                    className={`bar-seg seg-${i}`}
                    style={{ width: `${(asset.value / totalVal) * 100}%` }}
                  ></div>
                ))}
                {portfolio.length === 0 && <div className="bar-seg" style={{ width: "100%", background: "#374151" }}></div>}
              </div>

              <div className="dist-legend">
                {topAssets.map((asset, i) => (
                  <div key={asset.symbol} className="legend-item">
                    <span className={`dot dot-${i}`}></span>
                    {asset.symbol}
                    <span className="perc">{((asset.value / totalVal) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. CHART SECTION (Bottom Left) */}
          <div className="card chart-card">
            <div className="card-header">
              <span className="card-title">Chart</span>
              <div className="chart-controls">
                <button className="ctrl-btn">BTC ▼</button>
                <button className="ctrl-btn">Daily ▼</button>
              </div>
            </div>
            <div className="chart-visual">
              {/* CSS Grid Lines */}
              <div className="chart-grid-bg">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-line" style={{ top: `${i * 20}%` }}></div>)}
              </div>

              {/* SVG Path */}
              <div className="chart-path-container">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="graph-svg">
                  <path d="M0 35 L 10 25 L 20 30 L 30 20 L 50 15 L 70 25 L 85 10 L 100 5 V 40 H 0 Z" fill="url(#gGreen)" opacity="0.1" />
                  <path d="M0 35 L 10 25 L 20 30 L 30 20 L 50 15 L 70 25 L 85 10 L 100 5" fill="none" stroke="#bef264" strokeWidth="0.5" />
                  <defs>
                    <linearGradient id="gGreen" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#bef264" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* 4. TRANSACTIONS (Bottom Right) */}
          <div className="card transactions-card">
            <div className="card-header">
              <span className="card-title">Transactions</span>
              <div className="t-filters">
                <span>ALL</span>
                <span>SEND</span>
                <span>RECEIVE</span>
              </div>
            </div>
            <div className="t-list">
              <div className="t-date">Recent</div>
              {transactions.map(t => (
                <div key={t.id} className="t-row">
                  <div className={`t-icon ${t.type}`}>
                    {t.type === 'receive' ? '↓' : '↑'}
                  </div>
                  <div className="t-details">
                    <div className="t-amount">{t.amount} {t.asset}</div>
                    <div className="t-sub">
                      {t.type === 'receive' ? `Received from ${t.from}` : `Sent to ${t.to}`}
                    </div>
                  </div>
                  <div className="t-time">{t.time}</div>
                </div>
              ))}
              <button className="btn-see-all"> See all transactions › </button>
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
  padding-top: 80px; /* Offset for fixed navbar */
  min-height: 100vh;
  background: #0a0e17;
  display: flex;
  justify-content: center;
}

.nexanza-dash {
  display: grid;
  grid-template-columns: 1fr 1.5fr; 
  grid-template-areas: 
    "overview portfolio"
    "chart transactions";
  gap: 24px;
  padding: 24px;
  width: 100%;
  max-width: 1600px;
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

/* CARDS */
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

/* OVERVIEW (Green) */
.overview-card {
  grid-area: overview;
  background: linear-gradient(135deg, #d9f99d 0%, #bef264 100%);
  color: #000;
  border: none;
}
.overview-card .card-title { color: #000; }

.overview-stats { display: flex; gap: 40px; margin-bottom: 20px; }
.stat-box { display: flex; flex-direction: column; }
.stat-val { font-size: 24px; font-weight: 700; }
.stat-label { font-size: 12px; opacity: 0.7; }

.balance-display h1 { font-size: 32px; font-weight: 800; margin: 0; }
.balance-label { font-size: 13px; opacity: 0.7; }

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
.p-badge { color: #bef264; font-size: 11px; margin-left: 8px; }
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
.portfolio-card { grid-area: portfolio; }
.btn-text { background: #1f2937; border:none; color: #9ca3af; padding: 6px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; }

.portfolio-assets { display: flex; gap: 20px; margin-bottom: 30px; }
.asset-pill { display: flex; align-items: center; gap: 10px; }
.p-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; }
.p-info { display: flex; flex-direction: column; line-height: 1.2; }
.p-info b { font-size: 14px; color: white; }
.p-info span { font-size: 11px; color: #9ca3af; }

/* Dynamic Colors */
.pill-0 .p-icon, .bar-seg.seg-0, .dot.dot-0 { background: #f59e0b; } /* Orange */
.pill-1 .p-icon, .bar-seg.seg-1, .dot.dot-1 { background: #10b981; } /* Green */
.pill-2 .p-icon, .bar-seg.seg-2, .dot.dot-2 { background: #3b82f6; } /* Blue */

.assets-distribution { margin-top: auto; }
.dist-bar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: #374151; margin-bottom: 12px; }
.bar-seg { height: 100%; transition: width 0.5s ease; }

.dist-legend { display: flex; gap: 30px; font-size: 11px; color: #9ca3af; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.perc { margin-left: auto; color: #d1d5db; }

/* CHART */
.chart-card { grid-area: chart; min-height: 350px; }
.chart-controls { display: flex; gap: 8px; }
.ctrl-btn { background: #1f2937; color: #9ca3af; border: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; }
.chart-visual { flex: 1; position: relative; margin-top: 10px; background: #000; border-radius: 12px; overflow: hidden; }
.chart-grid-bg { position: absolute; inset: 0; pointer-events: none; }
.h-line { position: absolute; width: 100%; height: 1px; background: rgba(255,255,255,0.05); }
.chart-path-container { width: 100%; height: 100%; }
.graph-svg { width: 100%; height: 100%; }

/* TRANSACTIONS */
.transactions-card { grid-area: transactions; }
.t-filters span { margin-left: 12px; font-size: 11px; color: #6b7280; cursor: pointer; letter-spacing: 0.5px; }
.t-filters span:first-child { color: white; }

.t-list { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
.t-date { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
.t-row { display: flex; align-items: center; gap: 12px; }
.t-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.t-icon.receive { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.t-icon.send { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.t-details { flex: 1; }
.t-amount { font-size: 13px; color: white; font-weight: 500; }
.t-sub { font-size: 11px; color: #6b7280; }
.t-time { font-size: 11px; color: #6b7280; }

.btn-see-all { 
  margin-top: 16px; 
  width: 100%; 
  padding: 10px; 
  background: #1f2937; 
  color: #d1d5db; 
  border: none; 
  border-radius: 10px; 
  font-size: 12px; 
  cursor: pointer; 
  transition: 0.2s;
}
.btn-see-all:hover { background: #374151; color: white; }
`;