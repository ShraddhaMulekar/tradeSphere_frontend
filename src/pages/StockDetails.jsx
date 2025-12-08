import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

const StockDetails = () => {
  const { symbol } = useParams();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stock/quote/${symbol}`);
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.log("Error fetching quote:", err);
    }
  };

  useEffect(() => {
    fetchQuote();

    const interval = setInterval(fetchQuote, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  useEffect(() => {
    if (quote) setLoading(false);
  }, [quote]);

  if (loading) return <h2>Loading Stock Data...</h2>;

  return (
    <div style={styles.container}>
      <h2>{symbol} Stock Details</h2>

      <div style={styles.card}>
        <h3>Current Price</h3>
        <p style={styles.price}>₹{quote.price}</p>

        <p>
          <strong>Change: </strong>
          <span style={{ color: quote.d >= 0 ? "green" : "red" }}>
            {quote.d} ({quote.dp}%)
          </span>
        </p>
      </div>

      <div style={styles.metricsGrid}>
        <div style={styles.metricBox}>
          <h4>Open</h4>
          <p>₹{quote.o}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>High</h4>
          <p>₹{quote.h}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>Low</h4>
          <p>₹{quote.l}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>Previous Close</h4>
          <p>₹{quote.pc}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", width: "100%" },
  card: {
    background: "#1f2937",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  price: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  metricBox: {
    padding: "15px",
    background: "#f3f4f6",
    borderRadius: "10px",
    textAlign: "center",
  },
};

export default StockDetails;
