// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: { 
    type: String, 
    default: "https://tse2.mm.bing.net/th/id/OIP.-GDCqlIp43WC_CIn1brrFAHaHa?pid=Api&P=0&h=180" 
  },
  language: { type: String, default: "en" },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  online: { type: Boolean, default: false },
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
