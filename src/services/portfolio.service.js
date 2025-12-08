// src/services/portfolio.service.js
import { apiFetch } from "./apiFetch";
import { API_BASE_URL } from "../api/api";

export const getAllPortfolio = async () => {
  return await apiFetch(`${API_BASE_URL}/portfolio/all`, {
    method: "GET",
  });
};
