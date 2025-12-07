import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Supported NLLB language codes
const ALLOWED_LANG_CODES = ["en", "hi", "te", "fr", "ko"];

// Optional: map from language name -> code (in case some old clients send names)
const LANGUAGE_NAME_TO_CODE = {
  English: "en",
  Hindi: "hi",
  Telugu: "te",
  French: "fr",
  Korean: "ko",
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, language } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, password are required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Normalize language to NLLB code
    let langCode = language;

    // If frontend sent a full name like "English"
    if (langCode && LANGUAGE_NAME_TO_CODE[langCode]) {
      langCode = LANGUAGE_NAME_TO_CODE[langCode];
    }

    // If no language or invalid value, default to "en"
    if (!ALLOWED_LANG_CODES.includes(langCode)) {
      langCode = "en";
    }

    const user = new User({
      name,
      email,
      password: hashed,
      language: langCode,
      role: "user",
    });

    await user.save();
    res.send({ message: "User created" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const found = await User.findOne({ name });
    if (!found) return res.status(404).send("User not found");

    const match = await bcrypt.compare(password, found.password);
    if (!match) return res.status(400).send("Incorrect password");

    const token = jwt.sign({ id: found._id }, process.env.JWT_SECRET);
    res.send({ token, userId: found._id ,role: found.role});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Auth middleware
export function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach userId to request
    next(); // continue to route
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// check admin.
export async function checkAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admin only" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

router.get("/admin/users", checkAuth, checkAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
