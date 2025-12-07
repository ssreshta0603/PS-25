import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

export default function GetStarted() {
  return (
    <div className="login-page"  style={{
    backgroundImage: "url('/assets/background.jpeg')",
    backgroundSize: "cover",
    height: "100vh"
  }}>

      
      <h1
          className="title"
          style={{
            marginBottom: "60px",
            fontSize:"60px",
            fontFamily: "'Italiana', 'Noto Serif Display', 'Tangerine', serif",
            fontStyle: "italic",
            fontWeight: 400
          }}
        >
        LinguaLink: Your Journey Starts Here
      </h1>
      <p style={{color:"rgb(5, 86, 137)",fontFamily: "'Italiana', 'Noto Serif Display', 'Tangerine', serif",
            fontStyle: "bold"}}>Welcome to Seamless Global Communicaton.</p>

    
      <div
        className="login-box"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60px",
          width:"450px",
          backgroundColor:"rgba(174, 205, 212, 0.6)",
          boxShadow: "0px 0px 20px rgba(138, 160, 164, 0.3)",
          borderColor: "white"
        }}
      >
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <h4  style={{color:"rgb(5, 86, 137)", width: "200px" }}>
            GET STARTED 
          </h4>
        </Link>
      </div>
    </div>
  );
}

