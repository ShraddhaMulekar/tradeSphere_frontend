import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./pages/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import SearchStocks from "./pages/SearchStocks";
import StockDetails from "./pages/StockDetails";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import Wallet from "./pages/Wallet";
import AllOrders from "./components/AllOrders";
import LogoutButton from "./components/LogoutButton";
import PopularStocks from "./pages/PopularStocks";

const App = () => {
  return (
    <Routes>
      {/* ✅ Default home → Login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<LogoutButton />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="search" element={<SearchStocks />} />
        <Route path="search/:query" element={<SearchStocks />} />
        <Route path="stock/:symbol" element={<StockDetails />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="orders" element={<AllOrders />} />
        <Route path="popular" element={<PopularStocks />} />
      </Route>
    </Routes>
  );
};

export default App;
