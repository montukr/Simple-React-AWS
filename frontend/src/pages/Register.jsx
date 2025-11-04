import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/register", form);

      setMessage("✅ Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account ✨</h2>
        <p className="auth-sub">Register to unlock your AWS learning dashboard</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Username"
            value={form.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="auth-input"
          />

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {message && <p className="auth-msg">{message}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}
