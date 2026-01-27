import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { verifyPassword, createJWT } from "../../../lib/authUtils";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  await dbConnect();

  const user = await User.findOne({ email: email.toLowerCase() });

  // ❌ USER NOT FOUND
  if (!user) {
    console.log("LOGIN FAIL: user not found");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔐 PASSWORD VERIFY
  const ok = verifyPassword(password, user.salt, user.passwordHash);

  if (!ok) {
    console.log("LOGIN FAIL: password mismatch");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ CREATE TOKEN
  const token = createJWT({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // 🍪 SET COOKIE (1 YEAR)
  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
  );

  return res.status(200).json({
    ok: true,
    user: {
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
  });
}
