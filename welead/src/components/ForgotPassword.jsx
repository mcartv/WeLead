import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: enter email, Step 2: answer question
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: fetch security question
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/get_security_question?email=${email}`);
      const data = await res.json();

      if (res.ok && data.securityQuestion) {
        setQuestion(data.securityQuestion);
        setStep(2);
      } else {
        setError(data.error || "Email not found.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  // Step 2: verify answer and reset password
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!answer || !newPassword) {
      setError("Please answer the question and enter a new password.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answer, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful! You can now login.");
      } else {
        setError(data.error || "Invalid answer or email.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <p id="leads">LEADS</p>
        <h2>Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p style={{ color: "red", fontSize: "0.80rem" }}>{error}</p>}
            <button type="submit">Next</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleAnswerSubmit} className="auth-form">
            <label className="security-question">Question: {question}?</label>
            <input
              type="text"
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: "red", fontSize: "0.80rem" }}>{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit">Reset Password</button>
          </form>
        )}

        <p className="register">
          <Link to="/Login" className="register-link">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
