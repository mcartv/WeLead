import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar dark-nav">
      <a id="logo-link" href="#">
        LEADS
      </a>

      <div className="nav-right">
        <div className="nav-links">
          <a href="#portfolio">Portfolio</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        {/* Remove auth buttons entirely if user is logged in */}
        {!user && (
          <div className="auth-buttons">
            <button
              className="sign-in-btn dark-btn"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="sign-up-btn accent-btn"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
