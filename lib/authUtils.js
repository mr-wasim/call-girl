// lib/authUtils.js
import { randomBytes, scryptSync, createHash } from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "365d"; // default 1 year

if (!JWT_SECRET) throw new Error("Please set JWT_SECRET in .env.local");

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash: derived };
}

export function verifyPassword(password, salt, storedHash) {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return derived === storedHash;
}

export function createJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJWT(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
