import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar({ handleLogout }) {
  return (
    <div className="sidebar" style={styles.sidebar}>
      <Link to="/home" style={styles.item}>Home</Link>
      <Link to="/planner" style={styles.item}>Planner</Link>
      <Link to="/dashboard" style={styles.item}>Dashboard</Link>
      <Link to="/project-management" style={styles.item}>Project Management</Link>
      <Link to="/admin-slider" style={styles.item}>Admin Sliders</Link>
      <button onClick={handleLogout} style={{ ...styles.item, background: "transparent" }}>Logout</button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 250,
    padding: 16,
    background: "#f5f5f5",
    borderRight: "1px solid #ddd",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0
  },
  item: { display: "block", padding: "8px 12px", textDecoration: "none", color: "#333" }
};
