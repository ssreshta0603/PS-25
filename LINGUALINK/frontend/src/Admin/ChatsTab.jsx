import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatsTab() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/chats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setChats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#fff" }}>Loading chats...</div>;

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1e1e2f",
        minHeight: "400px",
        color: "#fff",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Chat Management</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#2c2c3e",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #444" }}>
              <th style={{ padding: "10px" }}>Chat ID</th>
              <th style={{ padding: "10px" }}>Users</th>
              <th style={{ padding: "10px" }}>Last Message</th>
              <th style={{ padding: "10px" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat._id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "8px" }}>{chat._id}</td>
                <td style={{ padding: "8px" }}>
                  {chat.users.map((u) => u.name).join(", ")}
                </td>
                <td style={{ padding: "8px" }}>
                  {chat.lastMessage ? chat.lastMessage.text : "-"}
                </td>
                <td style={{ padding: "8px" }}>
                  {chat.lastMessage
                    ? new Date(chat.lastMessage.timestamp).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
