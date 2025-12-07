// routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
import User from "../models/User.js";       // adjust path if needed
import { checkAuth } from "./auth.js";  // adjust path if needed

const router = express.Router();

/**
 * Helper: find or create a chat between two users
 */
const findOrCreateChat = async (userId, otherUserId) => {
  let chat = await Chat.findOne({
    users: { $all: [userId, otherUserId], $size: 2 }
  });

  if (!chat) {
    chat = await Chat.create({
      users: [userId, otherUserId],
      messages: []
    });
  }

  return chat;
};

/**
 * GET /api/chats
 * List all chats for logged-in user (with last message + friend info)
 */
router.get("/", checkAuth, async (req, res) => {
  try {
    const userId = req.userId; // FIXED
    
    const chats = await Chat.find({ users: userId }) // FIXED
      .populate("users", "name avatar language online"); // get friend info
    
    const formatted = chats.map((chat) => {
      const friend = chat.users.find(
        (u) => u._id.toString() !== userId.toString()
      );

      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      return {
        _id: chat._id,
        friend: friend
          ? { _id: friend._id, name: friend.name, avatar: friend.avatar, language:friend.language, online:friend.online }
          : null,
        lastMessage,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * GET /api/chats/with/:userId
 * Get full chat (all messages) with another user.
 * If no chat exists, it will be created (empty messages).
 */
router.get("/with/:userId", checkAuth, async (req, res) => {
  try {
    const me = req.userId;
    const otherUserId = req.params.userId;

    if (me.toString() === otherUserId.toString()) {
      return res.status(400).json({ error: "Cannot chat with yourself" });
    }

    const otherUser = await User.findById(otherUserId).select("name avatar");
    if (!otherUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // const chat = await findOrCreateChat(me, otherUserId);
    let chat = await Chat.findOne({
    users: { $all: [me, otherUserId], $size: 2 }
  });
    res.json({
      _id: chat._id,
      users: chat.users,
      messages: chat.messages,
      friend: otherUser,
    });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/chats/with/:userId
 * Send a message to another user.
 * Body: { text, translated }   (translated is optional)
 */
router.post("/with/:userId", checkAuth, async (req, res) => {
  try {
    const me = req.userId;
    const otherUserId = req.params.userId;
    const { text, translated } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let chat = await Chat.findOne({
    users: { $all: [me, otherUserId], $size: 2 }
  });
    const newMessage = {
      sender: me,
      text,
      translated: translated || "",
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    const savedMessage = chat.messages[chat.messages.length - 1];
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export { router as default, findOrCreateChat };
