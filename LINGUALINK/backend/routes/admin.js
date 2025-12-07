import express from "express";
import Chat from "../models/Chat.js";
import User from "../models/User.js"; import { checkAuth,checkAdmin } from "./auth.js";

const router = express.Router();

// Admin verification route
router.get("/verify", checkAuth, checkAdmin, async (req, res) => {
  try {
    // req.userId exists because checkAuth ran
    console.log("ADMIN ROUTES LOADED");
    const user = await User.findById(req.userId);
    res.json({ message: "Admin verified", name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
router.get("/users", checkAuth, checkAdmin, async (req, res) => {
  try {
    // Fetch all users except admins
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Admin: Get all chats with last message and users info
router.get("/chats", checkAuth, checkAdmin, async (req, res) => {
  try {
    const chats = await Chat.find().populate("users", "name avatar language");
    console.log(chats);
    const formatted = chats.map(chat => {
      const lastMessage = chat.messages.length
        ? chat.messages[chat.messages.length - 1]
        : null;

      return {
        _id: chat._id,
        users: chat.users.map(u => ({
          _id: u._id,
          name: u.name,
          avatar: u.avatar,
          language: u.language
        })),
        lastMessage
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get chat stats
// New analytics route
router.get("/onlineStats",checkAuth,checkAdmin,async(req,res)=>{
  try{
    const users = await User.find({});
    console.log(users);
    res.json({users: users});
  }catch(err){

  }
});
router.get("/stats", checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ timestamp: 1 });
    const chats = await Chat.find();
    
    // Users over time
    const usersOverTimeMap = {};
    users.forEach((u) => {
      if (!u.createdAt) return; // skip users without timestamp
      const date = u.createdAt.toISOString().split("T")[0];
      usersOverTimeMap[date] = (usersOverTimeMap[date] || 0) + 1;
      console.log("hiiii");
    });
    console.log(users);
    // Messages per user
    const messagesPerUserMap = {};
    chats.forEach((chat) => {
      if (!chat.messages) return;
      chat.messages.forEach((msg) => {
        if (!msg.sender) return;
        messagesPerUserMap[msg.sender] = (messagesPerUserMap[msg.sender] || 0) + 1;
      });
    });

    const usersMap = {};
    users.forEach((u) => (usersMap[u._id] = u.name));

    const messagesPerUser = Object.keys(messagesPerUserMap).map((uid) => ({
      name: usersMap[uid] || "Unknown",
      messages: messagesPerUserMap[uid],
    }));

    res.json({
      usersOverTime: Object.keys(usersOverTimeMap).map((date) => ({
        date,
        users: usersOverTimeMap[date],
      })),
      messagesPerUser,
      users:users,
      totalUsers: users.length,
      totalMessages: chats.reduce((acc, c) => acc + (c.messages?.length || 0), 0),
    });
  } catch (err) {
    console.error("Error in /stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
