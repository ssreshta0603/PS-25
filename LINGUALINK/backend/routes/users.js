import express from "express";
import User from "../models/User.js"; // add .js extension
import { checkAuth } from "./auth.js"; // ES module import

const router = express.Router();

// 1️⃣ Get current logged-in user
router.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/online
router.put("/online", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update online status
    user.online = req.body.online; // true/false
    await user.save();
    
    res.json({ message: "Online status updated", online: user.online });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;


// // 2️⃣ Search users by name (case-insensitive)
// router.get("/search", checkAuth, async (req, res) => {
//   const { q } = req.query;
//   if (!q) return res.json([]); // empty query returns empty list

//   try {
//     const users = await User.find(
//       { name: { $regex: q, $options: "i" } }, // case-insensitive search
//       "name avatar" // return only name and avatar
//     );
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
