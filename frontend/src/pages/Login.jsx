import { useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, role } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", role);

      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/user-dashboard";
      }
    } catch (err) {
      alert("Login failed", err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
