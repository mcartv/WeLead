import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Registration successful!");
          navigate("/");
        } else {
          alert(data.error || "Registration failed");
        }
      })
      .catch(() => alert("Server error. Please try again later."));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 id="leads">LEADS</h1>
        <h2>Create your account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* SECURITY QUESTION */}
          <select
            value={form.securityQuestion}
            onChange={(e) => setForm({ ...form, securityQuestion: e.target.value })}
            required
          >
            <option value="">Select a security question</option>
            <option value="mother_maiden">What is your mother’s maiden name?</option>
            <option value="first_pet">What was the name of your first pet?</option>
            <option value="first_school">What was the name of your first school?</option>
            <option value="favorite_city">What is your favorite city?</option>
            <option value="favorite_color">What is your favorite color?</option>
            <option value="favorite_food">What is your favorite food?</option>
            <option value="birth_city">In which city were you born?</option>
            <option value="father_middle_name">What is your father’s middle name?</option>
            <option value="childhood_nickname">What was your childhood nickname?</option>
            <option value="favorite_movie">What is your favorite movie?</option>
            <option value="favorite_book">What is your favorite book?</option>
            <option value="first_job">What was your first job?</option>
            <option value="favorite_teacher">Who was your favorite teacher?</option>
            <option value="dream_vacation">What is your dream vacation destination?</option>
            <option value="first_car">What was the make of your first car?</option>
            <option value="favorite_song">What is your favorite song?</option>
            <option value="best_friend">What is the name of your best friend?</option>
            <option value="grandparent_name">What is your grandparent’s name?</option>
            <option value="childhood_city">In which city did you grow up?</option>
            <option value="favorite_sport">What is your favorite sport?</option>
          </select>

          <input
            type="text"
            placeholder="Answer"
            value={form.securityAnswer}
            onChange={(e) => setForm({ ...form, securityAnswer: e.target.value })}
            required
          />

          {/* Password */}
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
            </div>
          </div>

          <button type="submit">Register</button>
        </form>

        <p className="register">
          Already have an account? <Link to="/Login" className="register-link">Login</Link>
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

export default Register;
