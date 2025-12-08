import { useEffect, useState } from "react";
import {
  getWatchlistAPI,
  addToWatchlistAPI,
  removeFromWatchlistAPI,
} from "../api/watchlist.api";

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  const loadWatchlist = async () => {
    const token = localStorage.getItem("token");
    const data = await getWatchlistAPI(token);
    setWatchlist(data.watchlist || []);
  };

  const addToWatchlist = async (symbol) => {
    const token = localStorage.getItem("token");
    const res = await addToWatchlistAPI(symbol, token);
    if (res.watchlist) setWatchlist(res.watchlist);
    else alert(res.message || "Add failed");
  };

  const removeFromWatchlist = async (symbol) => {
    const token = localStorage.getItem("token");
    const res = await removeFromWatchlistAPI(symbol, token);
    if (res.watchlist) setWatchlist(res.watchlist);
    else alert(res.message || "Remove failed");
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  return { watchlist, loadWatchlist, addToWatchlist, removeFromWatchlist };
};
