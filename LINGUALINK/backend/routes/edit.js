import express from "express";
import User from "../models/User.js"; // make sure to add .js
import { checkAuth } from "./auth.js"; 
const router = express.Router();

router.put("/",checkAuth, async (req, res) => {
    try {
    const { name, bio, avatar, language } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        ...(language !== undefined && { language })
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
