import { API_BASE_URL } from "../api/api";

export async function apiFetch(endpoint, options = {}) {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  const { method = "GET", body, headers: customHeaders = {} } = options;

  const headers = {
    ...customHeaders,
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    method,
    headers,
    ...(body && method !== "GET" ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `API Error: ${res.status}`;
    throw new Error(message);
  }

  return data;
}
