import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SellForm from "../components/SellForm";
import { useWallet } from "../context/WalletContext";
import { usePortfolio } from "../context/PortfolioContext";

export default function Portfolio() {
  const { portfolio, loadPortfolio } = usePortfolio();
  const { refreshWallet } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        loadPortfolio(),
        refreshWallet()
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleOpenSell = (item) => {
    setSelectedStock(item);
    setShowSellModal(true);
  };

  const handleSellSuccess = () => {
    loadPortfolio(); // Refresh portfolio data
    refreshWallet(); // Refresh cash balance
    // Maybe show a toast notification here later
  };

  // --- Calculations ---
  const calculatedPortfolio = portfolio.map((item) => {
    const qty = Number(item.quantity) || 0;
    const avgCost = Number(item.buyPrice) || 0;
    const ltp = Number(item.currentPrice) || 0;

    const invested = qty * avgCost;
    const currentVal = qty * ltp;
    const pnl = currentVal - invested;
    const netChg = invested === 0 ? 0 : (pnl / invested) * 100;

    // Mocking Day Change for visual completeness
    const dayChgPercent = (Math.random() * 2 - 1);
    const dayPnl = currentVal * (dayChgPercent / 100);

    return {
      ...item,
      qty,
      avgCost,
      ltp,
      invested,
      currentVal,
      pnl,
      netChg,
      dayChgPercent,
      dayPnl
    };
  });

  // Filter
  const filteredPortfolio = calculatedPortfolio.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals
  const totalInvestment = calculatedPortfolio.reduce((acc, item) => acc + item.invested, 0);
  const totalCurrentValue = calculatedPortfolio.reduce((acc, item) => acc + item.currentVal, 0);
  const totalPnl = totalCurrentValue - totalInvestment;
  const totalPnlPercent = totalInvestment === 0 ? 0 : (totalPnl / totalInvestment) * 100;

  const totalDayPnl = calculatedPortfolio.reduce((acc, item) => acc + item.dayPnl, 0);
  const totalDayPnlPercent = totalCurrentValue === 0 ? 0 : (totalDayPnl / totalCurrentValue) * 100;

  return (
    <div className="portfolio-page">
      <Navbar />
      <div className="p-container">

        {/* CENTERED HEADING */}
        <div className="p-header-center">
          <h1 className="main-title">
            My <span className="text-gradient">Portfolio</span>
            <button
              className={`btn-refresh-header ${isRefreshing ? 'spinning' : ''}`}
              onClick={handleManualRefresh}
              title="Refresh Portfolio"
            >
              ↻
            </button>
          </h1>
          <p className="sub-title">Manage your asset allocation and performance</p>
        </div>

        {/* COLORFUL STAT CARDS */}
        <div className="p-stats-grid">
          <div className="stat-card card-blue">
            <span className="sc-label">Total Investment</span>
            <span className="sc-val">₹{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="stat-card card-purple">
            <span className="sc-label">Current Value</span>
            <span className="sc-val">₹{totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="stat-card card-orange">
            <span className="sc-label">Day's P&L</span>
            <div className="sc-row">
              <span className="sc-val">
                {totalDayPnl >= 0 ? "+" : ""}₹{Math.abs(totalDayPnl).toFixed(2)}
              </span>
              <span className="sc-perc">
                {totalDayPnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="stat-card card-green">
            <span className="sc-label">Total P&L</span>
            <div className="sc-row">
              <span className="sc-val">
                {totalPnl >= 0 ? "+" : ""}₹{Math.abs(totalPnl).toFixed(2)}
              </span>
              <span className="sc-perc">
                {totalPnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="p-toolbar">
          <div className="p-section-title">Holdings ({portfolio.length})</div>
          <div className="p-actions">
            <input
              type="text"
              placeholder="Search assets..."
              className="p-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="p-table-container glass-panel">
          <table className="p-table">
            <thead>
              <tr>
                <th className="th-left">Instrument</th>
                <th>Qty.</th>
                <th>Avg. Cost</th>
                <th>LTP</th>
                <th>Invested</th>
                <th>Cur. Val</th>
                <th>P&L</th>
                <th>Net Chg.</th>
                <th>Day Chg.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolio.length === 0 ? (
                <tr><td colSpan="10" style={{ textAlign: "center", padding: "40px" }}>No holdings found</td></tr>
              ) : (
                filteredPortfolio.map((item) => (
                  <tr key={item.symbol}>
                    <td className="td-left instrument">{item.symbol}</td>
                    <td>{item.qty}</td>
                    <td>{item.avgCost.toFixed(2)}</td>
                    <td className="text-highlight">
                      {item.ltp.toFixed(2)}
                    </td>
                    <td>{item.invested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td>{item.currentVal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td className={item.pnl >= 0 ? "text-green" : "text-red"}>
                      {item.pnl.toFixed(2)}
                    </td>
                    <td className={item.netChg >= 0 ? "text-green" : "text-red"}>
                      {item.netChg.toFixed(2)}%
                    </td>
                    <td className={item.dayChgPercent >= 0 ? "text-green" : "text-red"}>
                      {item.dayChgPercent.toFixed(2)}%
                    </td>
                    <td>
                      <button className="btn-table-sell" onClick={() => handleOpenSell(item)}>Sell</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SELL MODAL */}
      {showSellModal && selectedStock && (
        <SellForm
          stock={selectedStock}
          onClose={() => setShowSellModal(false)}
          onSuccess={handleSellSuccess}
        />
      )}

      <style>{css}</style>
    </div>
  );
}

const css = `
.portfolio-page {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17; 
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

.p-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Centered Header */
.p-header-center {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.btn-refresh-header {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  transition: all 0.3s ease;
}

.btn-refresh-header:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: #a3e635;
}

.spinning {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.text-gradient {
  background: linear-gradient(to right, #facc15, #a3e635); /* Yellow to Lime */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sub-title {
  color: #94a3b8;
  font-size: 18px;
}

/* Stats Grid */
.p-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.stat-card {
  padding: 24px;
  border-radius: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 140px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.card-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}
.card-purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}
.card-orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
}
.card-green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.sc-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sc-val {
  font-size: 28px;
  font-weight: 700;
}

.sc-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.sc-perc {
  font-size: 14px;
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 12px;
}

/* Toolbar */
.p-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.p-section-title {
  font-size: 20px;
  color: white;
  font-weight: 600;
}

.p-search {
  background: #1e293b;
  border: 1px solid #334155;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  width: 250px;
  outline: none;
  transition: 0.3s;
}
.p-search:focus {
  border-color: #a3e635;
  box-shadow: 0 0 0 3px rgba(163, 230, 53, 0.1);
}

/* Table */
.p-table-container {
  background: #111827;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #1f2937;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.p-table {
  width: 100%;
  border-collapse: collapse;
}

.p-table th {
  text-align: right;
  padding: 16px 20px;
  color: #94a3b8;
  font-weight: 600;
  border-bottom: 1px solid #1f2937;
  background: #0f172a;
  white-space: nowrap;
}

.p-table td {
  text-align: right;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  color: #cbd5e1;
  font-weight: 500;
}

.p-table th.th-left, .p-table td.td-left {
  text-align: left;
}

.p-table tr:hover {
  background: rgba(255,255,255,0.02);
}

.instrument {
  color: white;
  font-weight: 700;
}

.text-green { color: #4ade80; }
.text-red { color: #f87171; }
.text-highlight { color: #fbbf24; }


  /* Sell Button */
  .btn-table-sell {
    padding: 6px 14px;
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-table-sell:hover {
    background: #ef4444;
    color: white;
    box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
  }

@media (max-width: 1024px) {
  .p-stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .p-table-container {
    overflow-x: auto;
  }
}

@media (max-width: 600px) {
  .p-stats-grid {
    grid-template-columns: 1fr;
  }
}
`;
