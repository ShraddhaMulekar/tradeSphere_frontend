import React, { createContext, useEffect, useReducer } from "react";
import { parseJwt } from "../utils/jwtUtils";
import { API_BASE_URL } from "../api/api";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        user: action.user || null,
        token: action.token || null,
        loading: false,
      };

    case "LOGIN":
      return {
        ...state,
        user: action.user,
        token: action.token,
        loading: false,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        loading: false,
      };

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ Load auth from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const user = parseJwt(token);
        dispatch({ type: "INIT", token, user });
      } catch (err) {
        localStorage.removeItem("token");
        dispatch({ type: "INIT" });
      }
    } else {
      dispatch({ type: "INIT" });
    }
  }, []);

  // ✅ Login
  const login = (token) => {
    localStorage.setItem("token", token);
    dispatch({
      type: "LOGIN",
      token,
      user: parseJwt(token),
    });
  };

  // ✅ Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.log("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};