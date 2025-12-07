import React, { useState } from "react";
import "../styles/createaccount.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateAccount() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState(""); // will store language code like "en"
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!user || !password || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: user,
        email: email,
        password: password,
        // send language code, default to "en" if not selected
        language: language || "en",
      });

      alert("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("Signup failed. Try again.");
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: "url('/assets/background.jpeg')",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <h1
        className="title"
        style={{
          fontSize: "60px",
          fontFamily: "'Italiana', 'Noto Serif Display', 'Tangerine', serif",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        Lingua Link
      </h1>

      <div className="login-box">
        <input
          className="input"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Enter New Username"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Enter New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label
          htmlFor="languages"
          style={{ color: "grey", display: "block", marginTop: "10px" }}
        >
          Select Preferred Language:
        </label>
        <select
          id="languages"
          name="languages"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ margin: "10px 0", height: "22px" }}
        >
          <option value="" disabled>
            Select a language
          </option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="te">Telugu</option>
          <option value="fr">French</option>
          <option value="ko">Korean</option>
        </select>

        <button className="login-btn" onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
}
