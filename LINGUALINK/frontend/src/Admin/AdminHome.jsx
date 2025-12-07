import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersOverTime: [],
    onlineCount: 0,
    offlineCount: 0,
    languageCount: {},
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res1 = await axios.get("http://localhost:5000/api/admin/onlineStats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Calculate online/offline & language count
        
        const onlineCount = res.data.users.filter(u=>{if(u.online){return u.online}}).length;
        const offlineCount = res.data.users.filter(u=>u.name).length-onlineCount;
        console.log(onlineCount);
        const languageCount = {};
        res.data.users.forEach(u => {
          languageCount[u.language] = (languageCount[u.language] || 0) + 1;
        });

        setStats({
          totalUsers: res.data.users.length,
          usersOverTime: res.data.usersOverTime,
          onlineCount,
          offlineCount,
          languageCount,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Pie chart for languages
  const languageData = {
    labels: Object.keys(stats.languageCount),
    datasets: [
      {
        label: "Languages",
        data: Object.values(stats.languageCount),
        backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0", "#00bcd4"],
      },
    ],
  };

  // Bar chart for online/offline users
  const onlineData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        label: "Users",
        data: [stats.onlineCount, stats.offlineCount],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  return (
    <div style={{ color: "#fff" }}>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <strong>Total Users:</strong> {stats.totalUsers}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <div>
          <h3>Languages</h3>
          <div style={{ maxWidth: "400px" }}>
            <Pie data={languageData} />
          </div>
        </div>

        <div>
          <h3>Online vs Offline</h3>
          <div style={{ maxWidth: "400px" }}>
            <Bar data={onlineData} />
          </div>
        </div>
      </div>
    </div>
  );
}
