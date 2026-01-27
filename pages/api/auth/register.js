import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { hashPassword } from "../../../lib/authUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, displayName } = req.body || {};

  if (!email || !password || !displayName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  await dbConnect();

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const { salt, hash } = hashPassword(password);

  const user = await User.create({
    displayName,
    email: email.toLowerCase(),
    passwordHash: hash,
    salt,
    role: "user",
  });

  return res.status(201).json({ ok: true });
}
