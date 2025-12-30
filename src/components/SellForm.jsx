import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";
import { useWallet } from "../context/WalletContext";

export default function SellForm({ stock, onClose, onSuccess }) {
  const { refreshWallet } = useWallet();
  const [quantity, setQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(stock.ltp || stock.currentPrice || stock.price || "");
  const [loading, setLoading] = useState(false);

  // Maximum quantity owned
  const maxQty = stock.qty || stock.quantity || 0;

  const handleSell = async () => {
    const parsedSellPrice = Number(sellPrice);
    const parsedQty = Number(quantity);

    if (!parsedSellPrice || parsedSellPrice <= 0) {
      return alert("Enter a valid sell price (greater than 0)");
    }
    if (!parsedQty || parsedQty <= 0) {
      return alert("Enter a valid quantity (greater than 0)");
    }
    if (parsedQty > maxQty) {
      return alert(`You only own ${maxQty} shares!`);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in");

      const body = {
        symbol: stock.symbol,
        quantity: parsedQty,
        price: parsedSellPrice,
      };

      const res = await fetch(`${API_BASE_URL}/trade/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Sell failed:", data);
        return alert(data.message || "Sell failed");
      }

      alert("✅ Sell Order placed! Your portfolio and wallet will update in 5 seconds.");

      // Immediate refresh
      refreshWallet();
      if (onSuccess) onSuccess();

      // Delayed sync for async completion
      setTimeout(() => {
        refreshWallet();
        if (onSuccess) onSuccess();
      }, 5000);

      // Close the form
      if (onClose) onClose();
    } catch (err) {
      console.error("handleSell error:", err);
      alert("Something went wrong while selling stock");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = (Number(sellPrice) * Number(quantity)).toFixed(2);
  const currentPrice = stock.ltp || stock.currentPrice || stock.price || 0;

  return (
    <div className="sell-form-overlay">
      <div className="sell-form-container">
        <div className="sell-form-card">
          {/* Header */}
          <div className="form-header">
            <div>
              <h2>Sell: {stock.symbol}</h2>
              <p className="stock-info">
                Available Qty: <strong>{maxQty}</strong>
              </p>
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Current Price */}
          <div className="form-group">
            <label>Current Market Price:</label>
            <div className="price-display">
              {currentPrice > 0 ? `₹${currentPrice.toFixed(2)}` : "Not Available"}
            </div>
          </div>

          {/* Sell Price Input */}
          <div className="form-group">
            <label>Sell Price: *</label>
            <input
              type="number"
              placeholder="Enter sell price"
              min="0.01"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Quantity Input */}
          <div className="form-group">
            <label>Quantity to Sell: *</label>
            <input
              type="number"
              placeholder={`Max: ${maxQty}`}
              min="1"
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`form-input ${Number(quantity) > maxQty ? 'error-border' : ''}`}
            />
            {Number(quantity) > maxQty && <span className="error-text">Exceeds available quantity!</span>}
          </div>

          {/* Total Value Display */}
          <div className="form-group">
            <label>Estimated Value:</label>
            <div className="total-display">₹{totalAmount}</div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-confirm-sell"
              onClick={handleSell}
              disabled={
                loading ||
                Number(sellPrice) <= 0 ||
                Number(quantity) <= 0 ||
                Number(quantity) > maxQty
              }
            >
              {loading ? "Processing..." : "Confirm Sell"}
            </button>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */
const css = `
/* Overlay */
.sell-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(5px);
}

/* Container */
.sell-form-container {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Card */
.sell-form-card {
  background: #1e293b; /* Dark theme card */
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  color: white;
  border: 1px solid #334155;
}

/* Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #334155;
}

.form-header h2 {
  font-size: 26px;
  color: #f87171; /* Red tint for sell */
  margin: 0 0 6px 0;
  font-weight: 700;
}

.stock-info {
  color: #94a3b8;
  margin: 0;
  font-size: 14px;
}
.stock-info strong { color: white; }

.close-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.2);
  color: white;
}

/* Form Group */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #475569;
  border-radius: 10px;
  font-size: 16px;
  background: #0f172a;
  color: white;
  outline: none;
  transition: all 0.3s;
}

.form-input:focus {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

.error-border { border-color: #ef4444 !important; }
.error-text { color: #ef4444; font-size: 12px; margin-top: 4px; display: block; }

/* Display Boxes */
.price-display,
.total-display {
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}

.price-display {
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  border: 1px solid #334155;
}

.total-display {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Buttons */
.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 28px;
}

.form-actions button {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #334155;
  color: #cbd5e1;
}

.btn-cancel:hover:not(:disabled) {
  background: #475569;
  color: white;
}

.btn-confirm-sell {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-confirm-sell:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.btn-confirm-sell:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile */
@media (max-width: 480px) {
  .sell-form-card { padding: 20px; }
  .form-actions { grid-template-columns: 1fr; }
  .btn-cancel { order: 2; }
  .btn-confirm-sell { order: 1; }
}
`;
