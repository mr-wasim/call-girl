// pages/api/admin/settings.js
import mongoose from "mongoose";
import Settings from "../../../models/Settings";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

async function connect() {
  if (!MONGODB_URI) throw new Error("Please set MONGODB_URI or MONGO_URI in .env.local");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const DEFAULTS = {
  primaryColor: "#111827",
  textColor: "#f3f4f6",
  headerBg: "#000000",
  headerText: "#ffffff",
  accentColor: "#f3bc1b",
  bodyBg: "#333333",
  footerBg: "#1f1f1f",
  footerText: "#d1d5db",
  fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
  borderRadius: "0.375rem",
  customized: false,
};

export default async function handler(req, res) {
  try {
    await connect();

    // Reset to defaults
    if (req.method === "POST" && req.query.action === "reset") {
      await Settings.deleteMany({});
      const s = new Settings(DEFAULTS);
      await s.save();
      return res.status(200).json({ ok: true, settings: s });
    }

    // GET - return the settings doc (create default if not exists)
    if (req.method === "GET") {
      let settings = await Settings.findOne({});
      if (!settings) {
        settings = new Settings(DEFAULTS);
        await settings.save();
      }
      return res.status(200).json({ ok: true, settings });
    }

    // PUT - update settings and mark as customized
    if (req.method === "PUT") {
      const payload = req.body || {};
      let settings = await Settings.findOne({});
      if (!settings) {
        settings = new Settings({ ...DEFAULTS, ...payload, customized: true });
      } else {
        Object.keys(payload).forEach((k) => {
          if (payload[k] !== undefined) settings[k] = payload[k];
        });
        settings.customized = true;
      }
      await settings.save();
      return res.status(200).json({ ok: true, settings });
    }

    res.setHeader("Allow", ["GET", "PUT", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("[/api/admin/settings] error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}
