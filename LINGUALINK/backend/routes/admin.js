import express from "express";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { checkAuth, checkAdmin } from "./auth.js";
import { ensureAdminChatForUser } from "./chat.js";
import nodemailer from "nodemailer";

const router = express.Router();

// -------------------- Gmail SMTP Setup --------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ssreshta0603@gmail.com",      // <-- Replace with your admin Gmail
    pass: "xucdlrymhnareaab"    // <-- Replace with Gmail App Password
  }
});

transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP error:", err);
  else console.log("✅ SMTP ready");
});

// -------------------- Admin Routes --------------------

// Admin verification
router.get("/verify", checkAuth, checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ message: "Admin verified", name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (excluding admins)
router.get("/users", checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all chats
router.get("/chats", checkAuth, checkAdmin, async (req, res) => {
  try {
    const chats = await Chat.find().populate("users", "name avatar language");
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

// Online stats
router.get("/onlineStats", checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// General stats
router.get("/stats", checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    const chats = await Chat.find();

    const usersOverTimeMap = {};
    users.forEach(u => {
      if (!u.createdAt) return;
      const date = u.createdAt.toISOString().split("T")[0];
      usersOverTimeMap[date] = (usersOverTimeMap[date] || 0) + 1;
    });

    const messagesPerUserMap = {};
    chats.forEach(chat => {
      if (!chat.messages) return;
      chat.messages.forEach(msg => {
        if (!msg.sender) return;
        const senderId = msg.sender.toString();
        messagesPerUserMap[senderId] = (messagesPerUserMap[senderId] || 0) + 1;
      });
    });

    const usersMap = {};
    users.forEach(u => (usersMap[u._id.toString()] = u.name));

    const messagesPerUser = Object.keys(messagesPerUserMap).map(uid => ({
      name: usersMap[uid] || "Unknown",
      messages: messagesPerUserMap[uid]
    }));

    res.json({
      usersOverTime: Object.keys(usersOverTimeMap).map(date => ({
        date,
        users: usersOverTimeMap[date]
      })),
      messagesPerUser,
      users,
      totalUsers: users.length,
      totalMessages: chats.reduce((acc, c) => acc + (c.messages?.length || 0), 0)
    });
  } catch (err) {
    console.error("Error in /stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- Bulk Email + Admin Chat --------------------
router.post("/bulk-email", checkAuth, checkAdmin, async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !subject || !message) {
    return res.status(400).json({ message: "Emails, subject, and message are required." });
  }

  let emailList = emails;
  if (typeof emails === "string") {
    emailList = emails.split(",").map(e => e.trim()).filter(Boolean);
  }

  try {
    const admin = await User.findOne({ role: "admin" });

    await Promise.all(
      emailList.map(async email => {
        // Send Email
        await transporter.sendMail({
          from: "ssreshta0603@gmail.com", // Gmail must be the same as sender
          to: email,
          subject,
          text: message
        });

        // Insert message into admin chat
        const user = await User.findOne({ email });
        if (!user) return;

        await ensureAdminChatForUser(user._id);

        const chat = await Chat.findOne({
          users: { $all: [admin._id, user._id], $size: 2 }
        });

        chat.messages.push({
          sender: admin._id,
          text: message,
          translated: "",
          timestamp: new Date()
        });

        await chat.save();
      })
    );

    res.json({ message: "Bulk email sent & chat messages delivered!" });
  } catch (err) {
    console.error("Bulk Email Error:", err);
    res.status(500).json({ message: "Failed to send emails.", error: err.message });
  }
});

export default router;