import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/api";
import Navbar from "./Navbar";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ✅ Fetch orders
  const fetchAllOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/order/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // console.error(data.message); 
        // Silent fail or toast
        setOrders([]);
        return;
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch Order Error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove order
  const handleRemove = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this order?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/order/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ reload orders after delete
      fetchAllOrders();
    } catch (err) {
      console.error("Delete Order Error:", err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="orders-page">
      <Navbar />

      <div className="o-container">
        <h1 className="o-title">Transaction <span className="text-gradient">History</span></h1>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state glass-panel">
            <h3>No Active Orders</h3>
            <p>Your trade history will appear here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const date = new Date(order.createdAt).toLocaleString();
              const isPending = order.status === 'pending';
              const isCompleted = order.status === 'completed';
              const isFailed = order.status === 'failed';

              let statusColor = '#94a3b8'; // gray
              let cardGradient = 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))';

              if (isCompleted) {
                statusColor = '#10b981';
                cardGradient = 'linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.02))';
              } else if (isPending) {
                statusColor = '#f59e0b';
                cardGradient = 'linear-gradient(145deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.02))';
              } else if (isFailed) {
                statusColor = '#ef4444';
                cardGradient = 'linear-gradient(145deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.02))';
              }

              return (
                <div
                  key={order._id}
                  className="order-card"
                  style={{ background: cardGradient, borderColor: `${statusColor}40` }}
                >
                  <div className="oc-header">
                    <div className="oc-symbol">{order.symbol}</div>
                    <div className="oc-badge" style={{ color: statusColor, background: `${statusColor}20`, border: `1px solid ${statusColor}40` }}>
                      {order.status}
                    </div>
                  </div>

                  <div className="oc-details">
                    <div className="oc-row">
                      <span>Type</span>
                      <strong style={{ textTransform: 'uppercase' }}>{order.type}</strong>
                    </div>
                    <div className="oc-row">
                      <span>Quantity</span>
                      <strong>{order.quantity}</strong>
                    </div>
                    <div className="oc-row">
                      <span>Price</span>
                      <strong>₹{Number(order.price).toFixed(2)}</strong>
                    </div>
                    <div className="oc-row total">
                      <span>Total Value</span>
                      <strong style={{ color: '#bef264' }}>₹{Number(order.total).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="oc-footer">
                    <span className="oc-date">{date}</span>
                    {isPending && (
                      <button
                        className="btn-remove"
                        onClick={() => handleRemove(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{css}</style>
    </div>
  );
};

export default AllOrders;

const css = `
.orders-page {
  padding-top: 80px; 
  min-height: 100vh;
  background: #0a0e17;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

.o-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.o-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
  font-weight: 800;
  color: white;
}

.text-gradient {
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 24px;
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
}

.oc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.oc-symbol {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.oc-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.oc-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.oc-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.oc-row span {
  font-size: 13px;
  color: #94a3b8;
}

.oc-row strong {
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.oc-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.oc-date {
  font-size: 13px;
  color: #64748b;
}

.btn-remove {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-remove:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .oc-details {
    grid-template-columns: 1fr 1fr;
  }
}
`;
