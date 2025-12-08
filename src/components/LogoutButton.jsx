import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handlelogOut = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Are you sure you want to logout?");
      window.location.href = "/login";
      return;
    }

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        alert("Logged out successfully");
        window.location.href = "/login";
      }
    } catch (error) {
      alert("Logout failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="logout-btn" onClick={handlelogOut} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </button>

      <style>{`
        .logout-btn {
          padding: 8px 14px;
          background: #e11d48;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: #be123c;
        }

        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}