import React, { useState, useEffect } from "react";
import UsersTab from "./UsersTab";
import ChatsTab from "./ChatsTab";
import LogsTab from "./LogsTab";
import AdminHome from "./AdminHome"; // NEW: overall stats
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard"); // default to Dashboard
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get("http://localhost:5000/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setLoading(false))
      .catch(() => navigate("/not-authorized"));
  }, [navigate]);

  if (loading) return <div style={{ color: "#fff" }}>Loading...</div>;

  const navButtonStyle = (active) => ({
    background: "none",
    color: active ? "#4caf50" : "#fff", // active tab green
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "left",
    padding: "8px 0"
  });

  return (
    <div style={{ display: "flex", backgroundColor: "#1e1e2f", minHeight: "100vh", color: "#fff" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", padding: "20px", backgroundColor: "#111122", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "bold" }}>Admin</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button onClick={() => setTab("Home")} style={navButtonStyle(tab === "Home")}>Dashboard</button>
          <button onClick={() => setTab("users")} style={navButtonStyle(tab === "users")}>User Management</button>
          <button onClick={() => setTab("chat")} style={navButtonStyle(tab === "chat")}>Chat Monitoring</button>
          <button onClick={() => setTab("logs")} style={navButtonStyle(tab === "logs")}>Logs & Analytics</button>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px" }}>
        {tab === "Home" && <AdminHome />}
        {tab === "users" && <UsersTab />}
        {tab === "chat" && <ChatsTab />}
        {tab === "logs" && <LogsTab />}
      </main>

    </div>
  );
}
