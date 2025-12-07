import express from "express";
import User from "../models/User.js"; // make sure to add .js

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  try {
    const users = await User.find(
      { name: { $regex: q, $options: "i" } }, // case-insensitive search
      "name avatar" // send only required fields
    );

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
