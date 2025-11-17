// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ handleLogout, user }) {  // Added user prop
  return (
    <div className="outer-wrapper">
      <div className="main-layout">
        <Sidebar handleLogout={handleLogout} user={user} />

        <div className="content-area">
          <Outlet /> {/* This is where each page (Home, Planner, etc.) will render */}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>LEADS</h3>
            <p>
              Architecture and Design Studio creating spaces that inspire and
              endure.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    </div>
  );
}