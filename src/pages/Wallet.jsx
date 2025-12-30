import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import Navbar from "../components/Navbar";

export default function Wallet() {
  const { wallet, addMoney, withdrawMoney, loading, refreshWallet } = useWallet();
  const [amount, setAmount] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleAdd = async () => {
    if (!amount) return alert("Enter amount");
    try {
      setLocalLoading(true);
      await addMoney(Number(amount));
      alert("Amount added successfully! Balance will update in 2 seconds.");
      setAmount("");

      // Secondary autorefresh after 2 seconds for reliability
      setTimeout(() => {
        refreshWallet();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount) return alert("Enter amount");
    if (amount > wallet) return alert("Insufficient balance");
    if (amount <= 0) return alert("Enter valid amount");
    try {
      setLocalLoading(true);
      await withdrawMoney(Number(amount));
      alert("Withdrawal successful! Balance will update in 2 seconds.");
      setAmount("");

      // Secondary autorefresh after 2 seconds for reliability
      setTimeout(() => {
        refreshWallet();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading && wallet === 0) {
    return (
      <div className="wallet-page">
        <Navbar />
        <div className="w-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div className="loader"></div>
          <p>Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <Navbar />
      <div className="w-container">
        <h1 className="w-title">
          My <span className="text-gradient">Wallet</span>
          <button
            className={`btn-refresh-header ${loading ? 'spinning' : ''}`}
            onClick={refreshWallet}
            title="Refresh balance"
          >
            ↻
          </button>
        </h1>

        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-content">
            <div className="b-icon">💰</div>
            <h2>Total Balance</h2>
            <div className="b-amount">₹{wallet.toFixed(2)}</div>
            <p className="b-subtitle">Available funds ready to trade</p>
          </div>
          <div className="b-glow"></div>
        </div>

        {/* Transaction Area */}
        <div className="glass-panel action-area">
          <h3>Manage Funds</h3>

          <div className="input-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-input"
            />
          </div>

          <div className="w-actions">
            <button
              className="btn-action btn-add"
              onClick={handleAdd}
              disabled={localLoading}
            >
              {localLoading ? "Processing..." : "Add Funds"}
            </button>
            <button
              className="btn-action btn-withdraw"
              onClick={handleWithdrawal}
              disabled={localLoading}
            >
              {localLoading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>

        {/* Quick Add Grid */}
        <div className="quick-add-section">
          <h4>Quick Load</h4>
          <div className="quick-grid">
            {[1000, 5000, 10000, 50000].map(val => (
              <button
                key={val}
                className="btn-quick"
                onClick={() => setAmount(val.toString())}
              >
                + ₹{val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
.wallet-page {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

.w-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.w-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
  font-weight: 800;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.btn-refresh-header:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: #a855f7;
}

.spinning {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.text-gradient {
  background: linear-gradient(to right, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Balance Card */
.balance-card {
  position: relative;
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(79, 70, 229, 0.3);
  overflow: hidden;
  margin-bottom: 30px;
}

.balance-content {
  position: relative;
  z-index: 2;
}

.b-icon {
  font-size: 48px;
  margin-bottom: 10px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.balance-card h2 {
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.b-amount {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.b-subtitle {
  font-size: 14px;
  opacity: 0.7;
}

.b-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  z-index: 1;
}

/* Action Area */
.action-area {
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  background: #111827;
  border: 1px solid #1f2937;
}

.action-area h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #cbd5e1;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

.currency-symbol {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #94a3b8;
  font-weight: 700;
}

.w-input {
  width: 100%;
  box-sizing: border-box; /* Fixes overflow */
  background: #0f172a;
  border: 2px solid #334155;
  padding: 16px 16px 16px 50px;
  border-radius: 12px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  outline: none;
  transition: 0.3s;
}

.w-input:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1);
}

.w-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-action {
  padding: 16px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
}

.btn-action:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.btn-action:active {
  transform: scale(0.98);
}

.btn-add {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.btn-add:hover {
  background: rgba(16, 185, 129, 0.2);
}

.btn-withdraw {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.btn-withdraw:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Quick Add */
.quick-add-section h4 {
  color: #94a3b8;
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.btn-quick {
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn-quick:hover {
  background: #a855f7;
  border-color: #a855f7;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .quick-grid {
    grid-template-columns: 1fr 1fr;
  }
}
`;