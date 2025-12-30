import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import Navbar from "../components/Navbar";
import BuyForm from "../components/BuyForm";
import SellForm from "../components/SellForm";
import { usePortfolio } from "../context/PortfolioContext";
import { useWallet } from "../context/WalletContext";

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { portfolio, loadPortfolio } = usePortfolio();
  const { refreshWallet } = useWallet();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  // Find if user owns this stock to show quantity in SellForm
  const userStock = portfolio.find(p => p.symbol === symbol);
  const userQty = userStock ? (userStock.qty || userStock.quantity || 0) : 0;

  // Fetch Quote
  const fetchQuote = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stock/quote/${symbol}`);
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.log("Error fetching quote:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  const isPositive = quote?.d >= 0;

  return (
    <div className="sd-page">
      <Navbar />

      <div className="sd-container">
        {loading ? (
          <div className="loading-state">Loading Market Data...</div>
        ) : !quote ? (
          <div className="error-state">Stock data not found.</div>
        ) : (
          <>
            {/* HEADER SECTION */}
            <div className="sd-header">
              <div className="sd-title-grp">
                <div className="sd-icon">{symbol[0]}</div>
                <div>
                  <h1 className="sd-sym">{symbol}</h1>
                  <span className="sd-name">Stock Asset</span>
                </div>
              </div>

              <div className="sd-price-grp">
                <h2 className="sd-price">₹{quote.price.toLocaleString('en-IN')}</h2>
                <div className={`sd-change ${isPositive ? 'pos' : 'neg'}`}>
                  {isPositive ? '▲' : '▼'} {quote.d} ({quote.dp}%)
                </div>
              </div>
            </div>

            {/* CHART AREA (Simulated Visual) */}
            <div className="sd-chart-card">
              <div className="chart-header">
                <span>Price Performance</span>
                <div className="chart-pills">
                  <span className="active">1D</span>
                  <span>1W</span>
                  <span>1M</span>
                  <span>1Y</span>
                </div>
              </div>
              <div className="chart-visual">
                {/* SVG Chart */}
                <svg viewBox="0 0 800 200" className="sd-chart-svg">
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,150 C100,100 200,${isPositive ? 50 : 180} 300,100 C400,150 500,${isPositive ? 20 : 190} 600,80 L800,100 L800,200 L0,200 Z`}
                    fill="url(#chartFill)"
                  />
                  <path
                    d={`M0,150 C100,100 200,${isPositive ? 50 : 180} 300,100 C400,150 500,${isPositive ? 20 : 190} 600,80 L800,100`}
                    fill="none"
                    stroke={isPositive ? "#10b981" : "#ef4444"}
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>

            {/* METRICS GRID */}
            <h3 className="section-head">Key Statistics</h3>
            <div className="sd-metrics-grid">
              <div className="metric-box">
                <span className="m-lbl">Open</span>
                <span className="m-val">₹{quote.o}</span>
              </div>
              <div className="metric-box">
                <span className="m-lbl">High</span>
                <span className="m-val">₹{quote.h}</span>
              </div>
              <div className="metric-box">
                <span className="m-lbl">Low</span>
                <span className="m-val">₹{quote.l}</span>
              </div>
              <div className="metric-box">
                <span className="m-lbl">Prev. Close</span>
                <span className="m-val">₹{quote.pc}</span>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="action-bar">
              <button className="btn-trade buy" onClick={() => setShowBuyModal(true)}>
                Buy {symbol}
              </button>
              <button className="btn-trade sell" onClick={() => setShowSellModal(true)}>
                Sell {symbol}
              </button>
            </div>
          </>
        )}
      </div>

      {/* BUY MODAL */}
      {showBuyModal && (
        <BuyForm
          stock={{ symbol: symbol, currentPrice: quote.price }}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {
            loadPortfolio(); // Refresh portfolio data
            refreshWallet(); // Refresh wallet too
            setShowBuyModal(false);
          }}
        />
      )}

      {/* SELL MODAL */}
      {showSellModal && (
        <SellForm
          stock={{
            symbol: symbol,
            currentPrice: quote.price,
            qty: userQty // Pass current quantity
          }}
          onClose={() => setShowSellModal(false)}
          onSuccess={() => {
            loadPortfolio(); // Refresh portfolio data
            refreshWallet(); // Refresh wallet too
            setShowSellModal(false);
          }}
        />
      )}

      <style>{css}</style>
    </div>
  );
};

export default StockDetails;

const css = `
.sd-page {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

.sd-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header */
.sd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.sd-title-grp { display: flex; align-items: center; gap: 16px; }

.sd-icon {
  width: 56px; height: 56px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700; color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.sd-sym { margin: 0; font-size: 32px; line-height: 1; color: white; }
.sd-name { font-size: 14px; color: #94a3b8; font-weight: 500; }

.sd-price-grp { text-align: right; }
.sd-price { margin: 0; font-size: 36px; color: white; font-weight: 800; }
.sd-change { font-size: 16px; font-weight: 600; margin-top: 4px; }
.sd-change.pos { color: #10b981; }
.sd-change.neg { color: #ef4444; }

/* Chart */
.sd-chart-card {
  background: #111827;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #1f2937;
  margin-bottom: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.chart-header {
  display: flex; justify-content: space-between; margin-bottom: 20px;
}
.chart-header span { font-size: 14px; font-weight: 600; color: #94a3b8; }

.chart-pills { display: flex; gap: 8px; }
.chart-pills span {
  padding: 4px 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.chart-pills span.active { background: #3b82f6; color: white; }

.chart-visual {
  height: 250px;
  width: 100%;
  position: relative;
}
.sd-chart-svg { width: 100%; height: 100%; overflow: visible; }

/* Metrics */
.section-head { font-size: 18px; color: white; margin-bottom: 20px; font-weight: 600; }

.sd-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.metric-box {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 16px;
  text-align: center;
}
.m-lbl { display: block; font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
.m-val { font-size: 18px; font-weight: 700; color: white; }

/* Actions */
.action-bar {
  display: flex; gap: 20px;
}
.btn-trade {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn-trade.buy {
  background: #10b981; color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
}
.btn-trade.buy:hover { background: #059669; }

.btn-trade.sell {
  background: #ef4444; color: white;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
}
.btn-trade.sell:hover { background: #dc2626; }

@media (max-width: 768px) {
  .sd-metrics-grid { grid-template-columns: 1fr 1fr; }
  .sd-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .sd-price-grp { text-align: left; }
}
`;
