import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const { name } = useParams();
  const navigate = useNavigate();

  const profileData = {
    Alice: { bio: "user", user: "alice@hi",profile:"https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180",lang: "Spanish"},
    Bob: { bio: "user", user: "bob@user",profile:"https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180", lang: "Korean" },
    Charlie: { age: "user", user: "charlie@",profile:"https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180",lang: "Hindi" },
  };

  const user = profileData[name];

  if (!user) return <div>User not found</div>;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "30%", // to not cover chat list
        width: "70%",
        height: "100%",
        backgroundColor: "#fff",
        zIndex: 1000,
        padding: "20px",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
      }}
    >
      <h1>{name}'s Profile</h1>
      
      <img src={user.profile} alt="avatar"/>
      <p>bio: {user.age}</p>
      <p>User: {user.user}</p>
      <p>Preference Language: {user.lang}</p>
      <button onClick={() => navigate(-1)}>← Back to Dashboard</button>
    </div>
  );
}
