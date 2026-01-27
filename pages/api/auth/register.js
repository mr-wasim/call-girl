import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { hashPassword } from "../../../lib/authUtils";

export default async function handler(req, res) {
  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { email, password, displayName } = req.body || {};

    if (!email || !password || !displayName) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing fields" });
    }

    await dbConnect();

    const exists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res
        .status(409)
        .json({ ok: false, message: "Email already registered" });
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
    // ⚠️ ALWAYS return JSON
    return res
      .status(500)
      .json({ ok: false, message: "Server error" });
  }
}
