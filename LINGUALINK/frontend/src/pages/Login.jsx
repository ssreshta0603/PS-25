import "../styles/Login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!user || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    // STEP 1: Login
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      name: user,
      password: password
    });

    const { token, userId } = response.data;

    // Save token + userId
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    // STEP 2: Check if user is admin
    try {
      const verify = await axios.get("http://localhost:5000/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // If success → it's admin
      localStorage.setItem("role", "admin");
      navigate("/admin");  // redirect admin
      return;

    } catch (adminErr) {
      // Not an admin → normal user
      localStorage.setItem("role", "user");
      navigate("/dashboard");
      return;
    }

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {
      alert(error.response.data);
    } else {
      alert("Login failed. Try again.");
    }
  }
};



  return (
    <div className="login-page" style={{
    backgroundImage: "url('/assets/background.jpeg')",
    backgroundSize: "cover",
    height: "100vh"
  }}>
      <h1 className="title" style={{fontSize:"60px",
            fontFamily: "'Italiana', 'Noto Serif Display', 'Tangerine', serif",
            fontStyle: "italic",fontWeight: 400}}>Lingua Link</h1>

      <div className="login-box">
        <input
          className="input"
          placeholder="Enter Email"
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <a href="/register" className="create-link">Create Account</a>
      </div>
    </div>
  );
}

