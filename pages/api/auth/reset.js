// pages/api/auth/reset.js
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { hashToken, hashPassword } from "../../../lib/authUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { token, email, newPassword } = req.body || {};
  if (!token || !email || !newPassword) return res.status(400).json({ message: "Missing fields" });

  await dbConnect();
  const hashed = hashToken(token);
  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const { salt, hash } = hashPassword(newPassword);
  user.salt = salt;
  user.passwordHash = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.status(200).json({ message: "Password reset successful" });
}
