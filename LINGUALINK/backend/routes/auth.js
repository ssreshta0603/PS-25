import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ensureAdminChatForUser } from "./chat.js";

const router = express.Router();

// Supported NLLB language codes
const ALLOWED_LANG_CODES = ["en", "hi", "te", "fr", "ko"];
const LANGUAGE_NAME_TO_CODE = {
  English: "en",
  Hindi: "hi",
  Telugu: "te",
  French: "fr",
  Korean: "ko",
};

// -------------------- Signup --------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, language } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, password are required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Normalize language
    let langCode = language;
    if (langCode && LANGUAGE_NAME_TO_CODE[langCode]) langCode = LANGUAGE_NAME_TO_CODE[langCode];
    if (!ALLOWED_LANG_CODES.includes(langCode)) langCode = "en";

    const user = new User({
      name,
      email,
      password: hashed,
      language: langCode,
      role: "user"
    });

    await user.save();

    // Ensure admin chat exists for new user
    await ensureAdminChatForUser(user._id);

    res.json({ message: "User created" });
  } catch (err) {
    console.error("Signup Error:", err);
    if (err.code === 11000) return res.status(400).json({ error: "Email already in use" });
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- Login --------------------
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    // Ensure admin chat exists for this user
    await ensureAdminChatForUser(user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- Middleware --------------------

// Auth middleware
export function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Admin check middleware
export async function checkAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ error: "Access denied: Admin only" });
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// -------------------- Admin Helper Route --------------------
router.get("/admin/users", checkAuth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;