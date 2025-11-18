import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaTachometerAlt,
  FaWpforms,
  FaProjectDiagram,
  FaTasks,
  FaCogs,
  FaImages,
  FaSignOutAlt,
  FaClipboardList,
  FaUserCheck,
  FaUser
} from "react-icons/fa";

export default function Sidebar({ user, handleLogout }) {
  
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {/* Home */}
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

            <Link to="/admin-panel" className="sidebar-item">
              <FaTasks className="icon" />
              <span className="label">Service Requests</span>
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
          </>
        )}

        {/* Project Tracker */}
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
