import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <div className="layout-body">
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <style>{css}</style>
    </div>
  );
};

const css = `
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0e17; /* Global dark bg */
}

.layout-body {
  display: flex;
  flex: 1;
  margin-top: 80px; /* Offset for new taller Navbar */
  justify-content: center;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1600px; /* Constrain max width for large screens */
  padding: 0;
  position: relative;
}
`;

export default MainLayout;