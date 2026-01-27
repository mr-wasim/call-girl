// pages/api/auth/register.js
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { hashPassword } from "../../../lib/authUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { email, password, displayName } = req.body || {};

    if (!email || !password || !displayName) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    await dbConnect();

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ ok: false, message: "Email already registered" });
    }

    const { salt, hash } = hashPassword(password);

    await User.create({
      displayName,
      email: email.toLowerCase(),
      passwordHash: hash,
      salt,
      role: "user",
    });

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("REGISTER API ERROR:", err);

    // handle duplicate key errors gracefully
    if (err?.code === 11000) {
      const key = Object.keys(err.keyValue || {})[0] || "field";
      return res.status(409).json({ ok: false, message: `${key} already exists` });
    }

    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
