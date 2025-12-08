import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex"
  },
  content: {
    flex: 1,
    padding: "20px"
  }
};

export default MainLayout;