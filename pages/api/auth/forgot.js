// pages/api/auth/forgot.js
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { randomBytes } from "crypto";
import { hashToken } from "../../../lib/authUtils";
import { sendEmail } from "../../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "Email required" });

  await dbConnect();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(200).json({ message: "If that email exists, a reset link has been sent" });
  }

  const token = randomBytes(32).toString("hex");
  const hashed = hashToken(token);
  const expire = Date.now() + 1000 * 60 * 60; // 1 hour

  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = new Date(expire);
  await user.save();

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetLink = `${base}/reset?token=${token}&email=${encodeURIComponent(user.email)}`;

  const html = `
    <p>Hello ${user.displayName},</p>
    <p>Click to reset password (valid 1 hour): <a href="${resetLink}">${resetLink}</a></p>
  `;
  try {
    await sendEmail({ to: user.email, subject: "Reset your password", html, text: `Reset: ${resetLink}` });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ message: "Unable to send reset email" });
  }

  return res.status(200).json({ message: "If that email exists, a reset link has been sent" });
}
