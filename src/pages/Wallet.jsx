import { useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function Wallet() {
  const { wallet, addMoney, withdrawMoney } = useWallet();
  const [amount, setAmount] = useState("");

  const handleAdd = async () => {
    if (!amount) return alert("Enter amount");
    try {
      await addMoney(Number(amount));
      alert("Amount added successfully");
      setAmount("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount) return alert("Enter amount");
    if(amount > wallet) return alert("Insufficient balance");
    if(amount <= 0) return alert("Enter valid amount");
    try {
      await withdrawMoney(Number(amount));
      alert("Withdrawal successful");
      setAmount("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="wallet-page">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-icon">💰</div>
        <h2>Wallet Balance</h2>
        <div className="balance-amount">₹{wallet.toFixed(2)}</div>
        <p className="balance-subtitle">Available funds in your account</p>
      </div>

      {/* Transaction Form */}
      <div className="transaction-container">
        <h3>Manage Your Funds</h3>
        
        <div className="input-group">
          <label htmlFor="amount">Enter Amount</label>
          <div className="input-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              min="1"
              step="1"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="button-grid">
          <button className="btn-add" onClick={handleAdd}>
            <span className="btn-icon">➕</span>
            <span className="btn-text">Add Money</span>
          </button>
          <button className="btn-withdraw" onClick={handleWithdrawal}>
            <span className="btn-icon">➖</span>
            <span className="btn-text">Withdraw</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Add</h4>
        <div className="quick-buttons">
          <button onClick={() => setAmount("1000")} className="quick-btn">₹1,000</button>
          <button onClick={() => setAmount("5000")} className="quick-btn">₹5,000</button>
          <button onClick={() => setAmount("10000")} className="quick-btn">₹10,000</button>
          <button onClick={() => setAmount("50000")} className="quick-btn">₹50,000</button>
        </div>
      </div>

      <style>{`
        .wallet-page {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Balance Card */
        .balance-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
        }

        .balance-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .balance-icon {
          font-size: 60px;
          margin-bottom: 10px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .balance-card h2 {
          margin: 0 0 15px 0;
          font-size: 18px;
          font-weight: 500;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }

        .balance-amount {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .balance-subtitle {
          margin: 0;
          font-size: 14px;
          opacity: 0.85;
          position: relative;
          z-index: 1;
        }

        /* Transaction Container */
        .transaction-container {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }

        .transaction-container h3 {
          margin: 0 0 24px 0;
          font-size: 22px;
          color: #1e293b;
          text-align: center;
        }

        /* Input Group */
        .input-group {
          margin-bottom: 24px;
        }

        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 10px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-symbol {
          position: absolute;
          left: 16px;
          font-size: 20px;
          font-weight: 700;
          color: #64748b;
          z-index: 1;
        }

        .input-wrapper input {
          width: 100%;
          padding: 16px 16px 16px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          transition: all 0.3s;
          box-sizing: border-box;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        /* Button Grid */
        .button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .button-grid button {
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .btn-icon {
          font-size: 24px;
        }

        .btn-text {
          font-size: 14px;
        }

        .btn-add {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-add:active {
          transform: translateY(0);
        }

        .btn-withdraw {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .btn-withdraw:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-withdraw:active {
          transform: translateY(0);
        }

        /* Quick Actions */
        .quick-actions {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 16px;
          padding: 24px;
          border: 2px solid #bae6fd;
        }

        .quick-actions h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #0c4a6e;
          text-align: center;
        }

        .quick-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .quick-btn {
          padding: 12px 20px;
          background: white;
          border: 2px solid #0ea5e9;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #0369a1;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-btn:hover {
          background: #0ea5e9;
          color: white;
          transform: scale(1.05);
        }

        .quick-btn:active {
          transform: scale(0.98);
        }

        /* Responsive */
        @media (max-width: 600px) {
          .wallet-page {
            padding: 15px;
          }

          .balance-amount {
            font-size: 36px;
          }

          .button-grid {
            grid-template-columns: 1fr;
          }

          .quick-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}