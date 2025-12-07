import "dotenv/config"; // loads .env automatically
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";
import usersRoutes from "./routes/users.js";
import translateRoutes from "./routes/translate.js";
import friendsRoutes from "./routes/friends.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("LinguaLink backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
