import { apiFetch } from "./apiFetch";

export const buyStock = (data) => {
  return apiFetch("/trade/buy", {
    method: "POST",
    body: data,
  });
};
