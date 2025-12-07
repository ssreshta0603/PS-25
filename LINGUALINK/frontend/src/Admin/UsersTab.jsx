// src/Admin/UserTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#fff" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", color: "#fff", background: "#1f1f2e", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "15px" }}>User Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#2c2c3a" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #444" }}>Avatar</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #444" }}>Name</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #444" }}>Email</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #444" }}>Role</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #444" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: "1px solid #444" }}>
              <td style={{ padding: "10px" }}>
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              </td>
              <td style={{ padding: "10px" }}>{user.name}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
              <td style={{ padding: "10px" }}>{user.role}</td>
              <td style={{ padding: "10px" }}>
                {new Date(user.createdAt || user.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
