import express from "express";
import User from "../models/User.js";
import { checkAuth } from "./auth.js"; // JWT middleware
import { findOrCreateChat } from "./chat.js";

const router = express.Router();

// -------------------------
// Send friend request
// -------------------------
router.post("/request", checkAuth, async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId)
      return res.status(400).json({ error: "receiverId required" });

    if (senderId === receiverId)
      return res.status(400).json({ error: "Cannot friend yourself" });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver)
      return res.status(404).json({ error: "User not found" });

    if (receiver.friends.includes(senderId))
      return res.status(400).json({ error: "Already friends" });

    if (receiver.friendRequests.includes(senderId))
      return res.status(400).json({ error: "Request already sent" });

    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// Accept friend request
// -------------------------
router.post("/accept", checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { requesterId } = req.body;

    if (!requesterId)
      return res.status(400).json({ error: "requesterId required" });

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester)
      return res.status(404).json({ error: "User not found" });

    if (!user.friendRequests.includes(requesterId))
      return res.status(400).json({ error: "No such friend request" });

    // Add each other as friends
    user.friends.push(requesterId);
    requester.friends.push(userId);

    // Remove from friendRequests
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await user.save();
    await requester.save();

    // create chat between new friends
    await findOrCreateChat(requesterId, userId);

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// Reject friend request
// -------------------------
router.post("/reject", checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { requesterId } = req.body;

    if (!requesterId)
      return res.status(400).json({ error: "requesterId required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const before = user.friendRequests.length;

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId.toString()
    );

    if (before !== user.friendRequests.length) {
      await user.save();
    }

    res.json({ success: true, message: "Friend request rejected" });
  } catch (err) {
    console.error("Error rejecting friend request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// Get friends + pending requests
// -------------------------
router.get("/list", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friends", "name avatar language online")
      .populate("friendRequests", "name avatar language");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;