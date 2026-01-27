// models/Settings.js
import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  primaryColor: { type: String, default: "#111827" },
  textColor: { type: String, default: "#f3f4f6" },
  headerBg: { type: String, default: "#000000" },
  headerText: { type: String, default: "#ffffff" },
  accentColor: { type: String, default: "#f3bc1b" },
  bodyBg: { type: String, default: "#333333" },
  footerBg: { type: String, default: "#1f1f1f" },
  footerText: { type: String, default: "#d1d5db" },
  fontFamily: { type: String, default: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont" },
  borderRadius: { type: String, default: "0.375rem" },
  // mark if admin has actually customized the settings (false until someone saves)
  customized: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
