import React, { useState, useRef, useEffect } from "react";
import "../styles/Dashboard.css";
import { useNavigate, Outlet, Link } from "react-router-dom";
import axios from "axios";

// Google translating function
// Translate message using NLLB backend (through Node API)
const translateMessage = async (text, fromLang, toLang) => {
  try {
    const response = await fetch("http://localhost:5000/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        from: fromLang || "en",
        to: toLang || "en"
      }),
    });

    const data = await response.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation failed:", err);
    return text;
  }
};


export default function Dashboard() {
  const [activeChat, setActiveChat] = useState(null);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  const [chats, setChats] = useState([]); // FULL CHAT LIST
  const [messages, setMessages] = useState([]); // ACTIVE CHAT MESSAGES

  const [searchResults, setSearchResults] = useState([]);
  const [me, setMe] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchUser, setSearchUser] = useState("");
const [friendList,setFriendList] = useState([]);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch self profile
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(res.data);
        await axios.put(
          "http://localhost:5000/api/users/online",
          { online: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchMe();
  }, []);

  // Fetch friends & friend requests
  const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/friends/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendList(res.data.friends);
      setFriends(res.data.friends.map((f) => f._id));
      setFriendRequests(res.data.friendRequests.map((f) => f._id));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchFriends();
  }, []);

  // Fetch Chats List
  const fetchChatList = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:5000/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChats(res.data);
    } catch (err) {
      console.log("Error fetching chats list:", err);
    }
  };
  useEffect(() => {
    fetchChatList();
  }, []);

  // Live search
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchUser) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/search?q=${searchUser}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [searchUser]);

  // ---------------------------
  // OPEN CHAT WITH FRIEND
  // ---------------------------
  const openChat = async (friendId, friendName, friendAvatar, friendLang) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/chats/with/${friendId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setActiveChat(res.data._id);
      setActiveFriend({
        _id: friendId,
        name: friendName,
        avatar: friendAvatar,
        language: friendLang,
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.log("Error opening chat:", err);
    }
  };

  // ---------------------------
  // SEND MESSAGE
  // ---------------------------
  const sendMessage = async () => {
    if (!messageInput || !activeFriend) return;

    const token = localStorage.getItem("token");
    const translated = await translateMessage(messageInput, me.language, activeFriend.language);
    console.log(translated);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/chats/with/${activeFriend._id}`,
        {
          text: messageInput,
          translated,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setMessageInput("");

      fetchChatList(); // update chat preview
    } catch (err) {
      console.log("Message send error:", err);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/friends/request",
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFriends();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error sending request");
    }
  };

  const acceptFriendRequest = async (requesterId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/friends/accept",
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFriends();
      fetchChatList();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error accepting request");
    }
  };

  const rejectFriendRequest = async (requesterId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/friends/reject",
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFriends();        
    fetchChatList();
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error accepting request");
    }
  };

  const getFriendButton = (userId) => {
    if (friends.includes(userId))
      return <button disabled style={{ marginLeft: "auto" }}>Friends</button>;

    if (friendRequests.includes(userId))
      return (
        <button
          style={{ marginLeft: "auto" }}
          onClick={() => acceptFriendRequest(userId)}
        >
          Accept
        </button>
      );
      return (
      <button
        style={{ marginLeft: "auto" }}
        onClick={() => sendFriendRequest(userId)}
      >
        +
      </button>
    );
  };

  const getRejectButton = (userId) => {
  if (friendRequests.includes(userId))
    return (
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => rejectFriendRequest(userId)}
      >
        Reject
      </button>
    );

  return null;
};

// log out.
const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.put(
        "http://localhost:5000/api/users/online",
        { online: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (err) {
    console.error("Error updating online status:", err);
  }

  // Clear local storage
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");

  // Redirect to login/home
  navigate("/");
};
    

    

  return (
    <div
      className="dashboard"
      style={{
        backgroundImage: "url('/assets/background.jpeg')",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      {/* LEFT SIDE */}
      <div className="chat-list">
        <div className="chat-header-top">
          <h2 style={{ color: "rgb(1, 73, 120)" }}>LINGUA LINK</h2>
          <img
            src={me.avatar}
            alt="LL"
            className="chat-avatar"
            onClick={() => navigate("/profile")}
          />
        </div>

        {/* SEARCH */}
        <ul>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={searchUser}
              placeholder="Enter username"
              style={{ width: "240px", height: "30px" }}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <button
              style={{ height: "36px", padding: "0 10px" }}
              onClick={() => setSearchUser(searchUser.trim())}
            >
              Search
            </button>
          </div>

          {/* SEARCH RESULTS */}
          {searchResults.map((u, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgb(206, 232, 240)",
                padding: "5px",
              }}
            >
              <img
                src={u.avatar}
                alt={u.name}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                }}
              />
              {u.name}
              {getFriendButton(u._id)}
              {getRejectButton(u._id)}
            </li>
          ))}
        </ul>
        {/* CHAT LIST */}
        <h3 style={{ marginTop: "10px" ,marginLeft:"10px",color: "rgb(1, 73, 120)" }}>Chats</h3>
                  
          <ul style={{ listStyle: "none", padding: 0 }}>
            {chats.map((chat) => (
              <li
                key={chat._id}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}
                onClick={() =>
                  openChat(
                    chat.friend._id,
                    chat.friend.name,
                    chat.friend.avatar,
                    chat.friend.language
                  )
                }
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={chat.friend.avatar}
                    alt=""
                    style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                  />
                  {/* Online indicator */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: chat.friend.online ? "green" : "gray",
                      border: "1px solid white"
                    }}
                  />
                </div>

                <div>
                  <div>{chat.friend.name}</div>
                  <small style={{ opacity: 0.7 }}>
                    {chat.lastMessage ? chat.lastMessage.text : "No messages yet"}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        <div className="logOut">
         <button onClick={()=>{handleLogout()}}>log out</button>
        </div>
      </div>

      {/* RIGHT SIDE CHAT WINDOW */}
      <div className="chat-window">
        {activeFriend ? (
          <>
            <div className="chat-header">
              <img
                src={activeFriend.avatar}
                alt=""
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              {activeFriend.name}
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.sender === me._id ? "me" : "other"
                  }`}
                >
                  {msg.text}
                  <br />
                  <small style={{ opacity: 0.6 }}>{msg.translated}</small>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="translate" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-messages empty">
            Select a chat to start messaging
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
}
