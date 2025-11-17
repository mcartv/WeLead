import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("Logged-in user:", data.user);

          setUser(data.user);

          // Redirect based on role
          if (data.user.role === "admin") {
            navigate("/dashboard"); // Admin goes to dashboard
          } else {
            navigate("/home"); // Client goes to home
          }
        } else {
          setError(data.error || "Login failed");
        }
      })

      .catch(() => setError("Server error. Please try again later."));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <p id="leads">LEADS</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div className="password-options">
              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                /> Show Password
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit">Login</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p className="register">
          Don't have an account?
          <Link to="/register" className="register-link">
            Register
          </Link>
        </p>

        <p className="back">
          <Link to="/" className="back-link">
            Back to Home Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
