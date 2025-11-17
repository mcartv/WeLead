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
    </div>
  );
}