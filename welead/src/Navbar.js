import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">LEADS</Link>
      <div className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/guest">Portfolio</Link>
      </div>
    </nav>
  );
}

export default Navbar;
