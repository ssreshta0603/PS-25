import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";
import usersRoutes from "./routes/users.js";
import translateRoutes from "./routes/translate.js";
import friendsRoutes from "./routes/friends.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";
import editRoutes from "./routes/edit.js";
import emailRoutes from "./routes/email.js"; // just transporter, used in admin.js
// admin.js
import transporter from "./routes/email.js"; 
const app = express();

// IMPORTANT — allow both frontend dev servers
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/editProfile", editRoutes);
app.use("/api/admin", adminRoutes);     // admin routes (bulk email, stats)
     // email transporter
const server = http.createServer(app);


// Test root route
app.get("/", (req, res) => {
  res.send("LinguaLink backend is running!");
});

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("send-message", ({ chatId, message }) => {
    socket.to(chatId).emit("receive-message", message);
  });
});

app.get("/", (req, res) => {
  res.send("LinguaLink backend running with WebSockets!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
