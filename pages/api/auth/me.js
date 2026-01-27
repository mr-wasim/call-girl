// pages/api/auth/me.js
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import cookie from "cookie";
import { verifyJWT } from "../../../lib/authUtils";

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) return res.status(200).json({ user: null });

  try {
    const decoded = verifyJWT(token);
    await dbConnect();
    const user = await User.findById(decoded.id).select("-passwordHash -salt -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(200).json({ user: null });
    return res.status(200).json({ user });
  } catch (err) {
    // invalid token
    return res.status(200).json({ user: null });
  }
}
