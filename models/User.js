// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: String, default: "user" }, // adviser omitted here
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
