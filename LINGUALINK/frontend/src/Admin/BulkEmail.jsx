//bulk mailing.
import React, { useState } from "react";
import axios from "axios";

export default function BulkEmail() {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendBulkEmail = async () => {
    if (!emails.trim()) {
      setStatus("Please enter at least one email.");
      return;
    }

    if (!subject.trim()) {
      setStatus("Please enter a subject.");
      return;
    }

    if (!message.trim()) {
      setStatus("Please enter a message.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/admin/bulk-email",
        {
          emails: emails.split(",").map(e => e.trim()),
          subject,
          message
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStatus(response.data.message || "Emails sent successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to send emails.");
    }
  };

  return (
    <div style={{ color: "#fff", maxWidth: "600px" }}>
      <h2>Bulk Email Sender</h2>

      <label>Email List (comma separated)</label>
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="example1@gmail.com, example2@gmail.com"
      />

      <label>Subject</label>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        placeholder="Enter email subject"
      />

      <label>Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="Enter email message here..."
      />

      <button
        onClick={sendBulkEmail}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          border: "none",
          cursor: "pointer",
          marginTop: "10px"
        }}
      >
        Send Emails
      </button>

      {status && (
        <p style={{ marginTop: "20px", color: "#4caf50" }}>{status}</p>
      )}
    </div>
  );
}
