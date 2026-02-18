import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaTachometerAlt,
  FaWpforms,
  FaProjectDiagram,
  FaCogs,
  FaImages,
  FaSignOutAlt,
  FaClipboardList,
  FaUserCheck,
  FaUser,
  FaCreditCard,
  FaCalendarCheck // already imported
} from "react-icons/fa";

export default function Sidebar({ user, handleLogout }) {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {/* Home - always visible */}
        <Link to="/home" className="sidebar-item">
          <FaHome className="icon" />
          <span className="label">Home</span>
        </Link>

        {/* Non-admin users */}
        {user.role !== "admin" && (
          <>
            <Link to="/planner" className="sidebar-item">
              <FaCalendarAlt className="icon" />
              <span className="label">Planner</span>
            </Link>
            <Link to="/form" className="sidebar-item">
              <FaWpforms className="icon" />
              <span className="label">Form</span>
            </Link>
            <Link to="/schedule-payment" className="sidebar-item">
              <FaCreditCard className="icon" />
              <span className="label">Schedule & Payment</span>
            </Link>
          </>
        )}

        {/* Admin / Architect */}
        {user.role === "admin" && (
          <>
            <Link to="/dashboard" className="sidebar-item">
              <FaTachometerAlt className="icon" />
              <span className="label">Dashboard</span>
            </Link>
            <Link to="/controlpanel" className="sidebar-item">
              <FaUserCheck className="icon" />
              <span className="label">User Control Panel</span>
            </Link>
            <Link to="/admin-review" className="sidebar-item">
              <FaClipboardList className="icon" />
              <span className="label">Review & Management</span>
            </Link>
            <Link to="/admin-portfolio" className="sidebar-item">
              <FaImages className="icon" />
              <span className="label">Portfolio Gallery</span>
            </Link>
            <Link to="/settings" className="sidebar-item">
              <FaCogs className="icon" />
              <span className="label">Settings</span>
            </Link>
            <Link to="/profile" className="sidebar-item">
              <FaUser className="icon" />
              <span className="label">Profile</span>
            </Link>
            <Link to="/inquiry-management" className="sidebar-item">
              <FaUserCheck className="icon" />
              <span className="label">Inquiry Management</span>
            </Link>
            {/* Scheduling Management - now inside admin block */}
            <Link to="/scheduling" className="sidebar-item">
              <FaCalendarCheck className="icon" />
              <span className="label">Scheduling</span>
            </Link>
          </>
        )}

        {/* Project Tracker - visible to all */}
        <Link to="/ProjectTracker" className="sidebar-item">
          <FaProjectDiagram className="icon" />
          <span className="label">Project Tracker</span>
        </Link>

        {/* Logout button at the bottom */}
        {user && (
          <button
            className="sidebar-item logout-btn"
            onClick={handleLogout}
            style={{ marginTop: "90px", display: "flex", alignItems: "center" }}
          >
            <FaSignOutAlt className="icon" />
            <span className="label">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}