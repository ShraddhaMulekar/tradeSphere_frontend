import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";

export default function PortfolioCard({ item, onSold }) {
  const [showSell, setShowSell] = useState(false);
  const [sellQty, setSellQty] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fallback values to prevent NaN
  const buyPrice = Number(item.buyPrice) || 0;
  const currentPrice = Number(item.currentPrice) || 0;
  const quantity = Number(item.quantity) || 0;

  const profitLoss = (currentPrice - buyPrice) * quantity;
  const isProfit = profitLoss >= 0;

  const handleSell = async () => {
    const qty = Number(sellQty);
    const price = Number(sellPrice);
    setError("");

    if (qty <= 0 || price <= 0) {
      setError("Quantity and price must be greater than 0");
      return;
    }

    if (qty > quantity) {
      setError("Cannot sell more than available quantity");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/trade/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: item.symbol,
          quantity: qty,
          price: price,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to sell stock");
        return;
      }

      alert("Stock sold successfully!");
      setShowSell(false);
      setSellQty("");
      setSellPrice("");
      onSold();
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.symbol}>{item.symbol}</h3>
            <span style={styles.quantity}>{quantity} shares</span>
          </div>
          <div style={styles.currentValue}>
            <div style={styles.valueLabel}>Current Value</div>
            <div style={styles.value}>₹{(currentPrice * quantity).toFixed(2)}</div>
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statRow}>
            <span>Avg. Buy Price</span>
            <span>₹{buyPrice.toFixed(2)}</span>
          </div>
          <div style={styles.statRow}>
            <span>Market Price</span>
            <span>₹{currentPrice.toFixed(2)}</span>
          </div>
          <div style={styles.statRow}>
            <span>P/L</span>
            <span style={{
              fontWeight: "600",
              color: isProfit ? "var(--success)" : "var(--danger)"
            }}>
              {isProfit ? "+" : ""}₹{profitLoss.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          className="btn-primary"
          style={styles.sellBtn}
          onClick={() => setShowSell(true)}
        >
          Sell Position
        </button>
      </div>

      {/* SELL MODAL */}
      {showSell && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Sell {item.symbol}</h3>

            <div style={styles.modalStats}>
              <p>Available Quantity: <strong>{quantity}</strong></p>
              <p>Current Market Price: <strong>₹{currentPrice}</strong></p>
            </div>

            {error && <div style={styles.errorBanner}>{error}</div>}

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity to Sell</label>
              <input
                type="number"
                placeholder="Ex. 5"
                value={sellQty}
                onChange={(e) => setSellQty(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Sell Price (Limit)</label>
              <input
                type="number"
                placeholder="Ex. 150.50"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowSell(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={styles.confirmBtn}
                onClick={handleSell}
                disabled={loading}
              >
                {loading ? "Selling..." : "Confirm Sell"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  card: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  symbol: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
  },
  quantity: {
    color: "var(--text-muted)",
    fontSize: "14px",
  },
  currentValue: {
    textAlign: "right",
  },
  valueLabel: {
    fontSize: "12px",
    color: "var(--text-muted)",
    marginBottom: "4px",
  },
  value: {
    fontSize: "20px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "rgba(0,0,0,0.2)",
    padding: "16px",
    borderRadius: "12px",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  sellBtn: {
    width: "100%",
    marginTop: "auto",
    background: "rgba(239, 68, 68, 0.9)", // Red for sell action
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
  },
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalContent: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    margin: "20px",
  },
  modalTitle: {
    fontSize: "24px",
    color: "var(--text-primary)",
    marginBottom: "20px",
    textAlign: "center",
  },
  modalStats: {
    background: "rgba(255,255,255,0.05)",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "16px",
  },
  errorBanner: {
    color: "#ef4444",
    background: "rgba(239, 68, 68, 0.1)",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    borderRadius: "8px",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    background: "#ef4444", // Red for confirm sell
  }
};
