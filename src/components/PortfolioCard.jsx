import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";

export default function PortfolioCard({ item, onSold }) {
  const [showSell, setShowSell] = useState(false);
  const [sellQty, setSellQty] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const profitLoss = (item.currentPrice - item.buyPrice) * item.quantity;
  const isProfit = profitLoss >= 0;

  const handleSell = async () => {
    const qty = Number(sellQty);
    const price = Number(sellPrice);
    setError("");

    if (sellQty <= 0 || sellPrice <= 0) {
      setError("Quantity and price must be greater than 0");
      return;
    }

    if (Number(sellQty) > item.quantity) {
      setError("Please check the available quantity");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/trade/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: item.symbol,
          quantity: Number(sellQty),
          price: Number(sellPrice),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      alert("Stock sold successfully!");

      setShowSell(false);
      setSellQty("");
      setSellPrice("");
      onSold(); // ✅ refresh portfolio
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <>
      {/* ================= PORTFOLIO CARD ================= */}
      <div className="portfolio-card">
        <h3>{item.symbol}</h3>
        <p>Qty: {item.quantity}</p>
        <p>Buy Price: ₹{item.buyPrice}</p>
        <p>
          Current Price:{" "}
          <span className={isProfit ? "profit" : "loss"}>
            ₹{item.currentPrice}
          </span>
        </p>
        <p>
          P/L:{" "}
          <span className={isProfit ? "profit" : "loss"}>₹{profitLoss}</span>
        </p>

        <button className="sell-btn" onClick={() => setShowSell(true)}>
          Sell
        </button>
      </div>

      {/* ================= SELL FORM MODAL ================= */}
      {showSell && (
        <div className="modal">
          <div className="modal-box">
            <h2 className="heading-sell">Sell Stock</h2>

            <p>
              <b>Symbol:</b> {item.symbol}
            </p>
            <p>
              <b>Available Qty:</b> {item.quantity}
            </p>

            <input
              type="number"
              placeholder="Sell Quantity"
              value={sellQty}
              onChange={(e) => setSellQty(Number(e.target.value))}
            />

            <input
              type="number"
              placeholder="Sell Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <div className="btn-row">
              <button className="cancel" onClick={() => setShowSell(false)}>
                Cancel
              </button>
              <button className="confirm" onClick={handleSell}>
                Sell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
        .portfolio-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          background: #fafafa;
          width: 260px;
        }

        .heading-sell{
          font-size: 30px;
          color: #901a08;
          text-align: center;
        }

        .profit { color: green; font-weight: bold; }
        .loss { color: red; font-weight: bold; }

        .sell-btn {
          margin-top: 10px;
          width: 100%;
          padding: 8px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-box {
          background: white;
          padding: 50px;
          border-radius: 10px;
          width: 250px;
        }

        .modal-box input {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
        }

        .btn-row {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
        }

        .cancel {
          background: #9ca3af;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
        }

        .confirm {
          background: #16a34a;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          color: white;
        }

        .error {
          color: red;
          margin-top: 8px;
        }
      `}</style>
    </>
  );
}
