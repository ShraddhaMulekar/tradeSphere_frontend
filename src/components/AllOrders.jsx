import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/api";

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
        alert(data.message);
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

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="orders-container">
      <h2 className="title">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>{order.symbol} Ltd</h3>
            <div className="details">
              <div className="all-detail">
                <p>
                  <b>Quantity:</b> {order.quantity}
                </p>
                <p>
                  <b>Price:</b> ₹{order.price}
                </p>
                <p>
                  <b>Total:</b> ₹{order.total}
                </p>
                <p>
                  <b>Type:</b> {order.type}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="date-remove_btn">
                <p className="date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                {order.status === "pending" && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(order._id)}
                  >
                    ❌ Remove
                  </button>
                )}
                
              </div>
            </div>
          </div>
        ))
      )}

      {/* ✅ CSS IN SAME FILE */}
      <style>{css}</style>
    </div>
  );
};

export default AllOrders;

/* ===================== CSS ===================== */

const css = `
.orders-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
}

.loading {
  text-align: center;
  font-size: 20px;
}

.empty {
  text-align: center;
  color: #6b7280;
}

.details{
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.order-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 15px;
  background: #f9fafb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.order-card p {
  margin: 6px 0;
}

.order-card h3 {
  text-transform: uppercase;
  text-align: center;
}

.status {
  font-weight: bold;
  text-transform: capitalize;
}

.status.pending { /* ✅ lowercase */
  color: #f59e0b;
}

.status.completed { /* ✅ lowercase */
  color: #16a34a;
}

.status.failed { /* ✅ lowercase */
  color: #dc2626;
}

.date {
  font-size: 12px;
  color: #6b7280;
  margin-top: 5px;
}

.remove-btn {
  margin-top: 10px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #dc2626;
}
`;
