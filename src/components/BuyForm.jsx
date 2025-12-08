import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";

export default function BuyForm({ stock, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [buyPrice, setBuyPrice] = useState(stock.currentPrice || stock.price || "");
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    const parsedBuyPrice = Number(buyPrice);
    const parsedQty = Number(quantity);

    if (!parsedBuyPrice || parsedBuyPrice <= 0) {
      return alert("Enter a valid buy price (greater than 0)");
    }
    if (!parsedQty || parsedQty <= 0) {
      return alert("Enter a valid quantity (greater than 0)");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in");

      const body = {
        symbol: stock.symbol,
        quantity: parsedQty,
        price: parsedBuyPrice,
      };

      const res = await fetch(`${API_BASE_URL}/trade/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Buy failed:", data);
        return alert(data.message || "Buy failed");
      }

      alert("✅ Order placed! It will be completed in 10 seconds.");
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
      // Close the form
      if (onClose) onClose();
    } catch (err) {
      console.error("handleBuy error:", err);
      alert("Something went wrong while buying stock");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = (Number(buyPrice) * Number(quantity)).toFixed(2);
  const currentPrice = stock.currentPrice || stock.price || 0;

  return (
    <div className="buy-form-overlay">
      <div className="buy-form-container">
        <div className="buy-form-card">
          {/* Header */}
          <div className="form-header">
            <div>
              <h2>Buy: {stock.symbol}</h2>
              {stock.name && <p className="stock-name">{stock.name}</p>}
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Current Price */}
          <div className="form-group">
            <label>Current Price:</label>
            <div className="price-display">
              {currentPrice > 0 ? `₹${currentPrice.toFixed(2)}` : "Not Available"}
            </div>
          </div>

          {/* Buy Price Input */}
          <div className="form-group">
            <label>Buy Price: *</label>
            <input
              type="number"
              placeholder="Enter buy price"
              min="0.01"
              step="0.01"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Quantity Input */}
          <div className="form-group">
            <label>Quantity: *</label>
            <input
              type="number"
              placeholder="Enter quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Total Amount Display */}
          <div className="form-group">
            <label>Total Amount:</label>
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
              className="btn-confirm"
              onClick={handleBuy}
              disabled={
                loading ||
                Number(buyPrice) <= 0 ||
                Number(quantity) <= 0 ||
                (currentPrice === 0 && !buyPrice)
              }
            >
              {loading ? "Processing..." : "Confirm Buy"}
            </button>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

/* ================= RESPONSIVE CSS ================= */
const css = `
/* Overlay */
.buy-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

/* Container */
.buy-form-container {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Card */
.buy-form-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.form-header h2 {
  font-size: 26px;
  color: #1e40af;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.stock-name {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* Form Group */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

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
  background: #f1f5f9;
  color: #1e293b;
  border: 2px solid #e2e8f0;
}

.total-display {
  background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
  color: #16a34a;
  border: 2px solid #86efac;
}

/* Action Buttons */
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
  transition: all 0.3s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover:not(:disabled) {
  background: #e2e8f0;
  color: #475569;
}

.btn-confirm {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
}

.btn-confirm:disabled,
.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ================= RESPONSIVE ================= */

/* Tablet */
@media (max-width: 768px) {
  .buy-form-overlay {
    padding: 15px;
  }

  .buy-form-card {
    padding: 24px;
  }

  .form-header h2 {
    font-size: 22px;
  }

  .form-input {
    font-size: 16px;
  }

  .price-display,
  .total-display {
    font-size: 18px;
    padding: 12px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .buy-form-overlay {
    padding: 10px;
    align-items: flex-end;
  }

  .buy-form-container {
    max-height: 85vh;
  }

  .buy-form-card {
    padding: 20px;
    border-radius: 16px 16px 0 0;
  }

  .form-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }

  .form-header h2 {
    font-size: 20px;
  }

  .stock-name {
    font-size: 12px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-input {
    padding: 10px 14px;
    font-size: 15px;
  }

  .price-display,
  .total-display {
    font-size: 16px;
    padding: 10px;
  }

  .form-actions {
    gap: 10px;
    margin-top: 20px;
  }

  .form-actions button {
    padding: 12px 16px;
    font-size: 15px;
  }
}

/* Small Mobile */
@media (max-width: 360px) {
  .buy-form-card {
    padding: 16px;
  }

  .form-header h2 {
    font-size: 18px;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }

  .btn-cancel {
    order: 2;
  }

  .btn-confirm {
    order: 1;
  }
}
`;