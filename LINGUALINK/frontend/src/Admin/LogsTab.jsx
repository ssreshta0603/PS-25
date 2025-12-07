import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";

export default function LogsTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  console.log(stats);
  if (!stats) return <div style={{ color: "#fff" }}>Loading stats...</div>;

  return (
    <div style={{ padding: 20, background: "#1f1f1f", color: "#fff" }}>
      <h2>Logs & Analytics</h2>

      <div style={{ marginBottom: 30 }}>
        <h3>Users Over Time</h3>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={stats.usersOverTime}>
              <XAxis dataKey="date" stroke="#bbb"/>
              <YAxis stroke="#bbb"/>
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3>Messages Per User</h3>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={stats.messagesPerUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
              <XAxis dataKey="name" stroke="#bbb"/>
              <YAxis stroke="#bbb"/>
              <Tooltip />
              <Bar dataKey="messages" fill="#60a5fa"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3>Summary</h3>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ padding: 20, background: "#333", borderRadius: 8 }}>Total Users: {stats.totalUsers}</div>
          <div style={{ padding: 20, background: "#333", borderRadius: 8 }}>Total Messages: {stats.totalMessages}</div>
        </div>
      </div>
    </div>
  );
}
