import { API_BASE_URL } from "./api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getWatchlistAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/watchlist/all`, {
    method: "GET",
    headers: getAuthHeader(), 
  });

  return res.json();
};

export const addToWatchlistAPI = async (symbol) => {
  const res = await fetch(`${API_BASE_URL}/watchlist/add`, {
    method: "POST",
    headers: getAuthHeader(), 
    body: JSON.stringify({ symbol }),
  });

  return res.json();
};

export const removeFromWatchlistAPI = async (symbol) => {
  const res = await fetch(`${API_BASE_URL}/watchlist/remove`, {
    method: "POST",
    headers: getAuthHeader(), 
    body: JSON.stringify({ symbol }),
  });

  return res.json();
};