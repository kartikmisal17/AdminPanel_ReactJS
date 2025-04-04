import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2025/users");
      const data = await response.json();

      const user = data.users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        localStorage.setItem("isAuthenticated", "true");  // ✅ Authentication Status Set
        alert("Login Successfully");
        navigate("/home");  // 🔄 Redirect to Home Page
      } else {
        alert("Invalid Username or Password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="login-box">
      <div className="signin">
        <div className="content">
          <h2>Admin Login</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="inputBox">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <i>Username</i>
            </div>
            <div className="inputBox">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i>Password</i>
            </div>
            <div className="inputBox">
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
