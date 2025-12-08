import { useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PortfolioCard from "../components/PortfolioCard";

export default function Portfolio() {
  const { portfolio, loadPortfolio } = usePortfolio();

  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Portfolio</h2>

      {portfolio.length === 0 && (
        <p style={styles.noData}>No holdings found.</p>
      )}

      <div style={styles.list}>
        {portfolio.map((item) => (
          <PortfolioCard
            key={item._id}
            item={item}
            onSold={loadPortfolio} 
          />
        ))}
      </div>
    </div>
  );
}

/* ✅ STYLES DEFINED AFTER RETURN */
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
  },

  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },

  noData: {
    textAlign: "center",
    color: "#888",
    fontSize: "16px",
  },
};
