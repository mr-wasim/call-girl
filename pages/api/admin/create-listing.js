// pages/api/admin/create-listing.js
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Listing from "../../../models/Listing";

export const config = { api: { bodyParser: false } };

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";
let cached = global._mongooseConnection || null;
if (!cached) cached = global._mongooseConnection = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("Please set MONGODB_URI or MONGO_URI");
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
  cached.conn = await cached.promise;
  return cached.conn;
}

function ensureUploadsDir() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok:false, message: "Method not allowed" });
  }

  await connect();
  ensureUploadsDir();

  const form = new IncomingForm({ multiples: true, keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("form parse error", err);
        return res.status(500).json({ ok:false, message: "Form parse failed" });
      }

      // fields: name, city, age, price, description
      const name = fields.name || "";
      const citySlug = fields.city || "";
      const age = fields.age || "";
      const price = fields.price || "";
      const descriptionHtml = fields.description || "";

      // files: profileImages (could be array) and variantImages
      const uploadedProfile = [];
      const uploadedVariant = [];

      // helper to move file
      async function moveFile(file) {
        const tmp = file.filepath || file.path;
        const orig = file.originalFilename || file.name || `upload-${Date.now()}.png`;
        const ext = path.extname(orig) || ".png";
        const fn = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
        const dest = path.join(process.cwd(), "public", "uploads", fn);
        // move
        try {
          await fs.promises.rename(tmp, dest);
        } catch (e) {
          // fallback copy
          await new Promise((resolve, reject) => {
            const rs = fs.createReadStream(tmp);
            const ws = fs.createWriteStream(dest);
            rs.pipe(ws);
            ws.on("finish", resolve);
            ws.on("error", reject);
          });
          try { await fs.promises.unlink(tmp); } catch {}
        }
        return `/uploads/${fn}`;
      }

      // formidable v3+ returns single file or array
      if (files.profileImages) {
        if (Array.isArray(files.profileImages)) {
          for (const f of files.profileImages) uploadedProfile.push(await moveFile(f));
        } else {
          uploadedProfile.push(await moveFile(files.profileImages));
        }
      }
      if (files.variantImages) {
        if (Array.isArray(files.variantImages)) {
          for (const f of files.variantImages) uploadedVariant.push(await moveFile(f));
        } else {
          uploadedVariant.push(await moveFile(files.variantImages));
        }
      }

      // profileOrder might be passed as JSON string of filenames
      let profileOrder = [];
      try {
        if (fields.profileOrder) profileOrder = JSON.parse(fields.profileOrder);
      } catch {}

      // save listing
      const listing = new Listing({
        name,
        citySlug,
        age,
        price,
        descriptionHtml,
        profileImages: uploadedProfile,
        variantImages: uploadedVariant,
        profileOrder,
      });

      await listing.save();
      return res.status(201).json({ ok:true, listing });
    } catch (err2) {
      console.error("[/api/admin/create-listing] error", err2);
      return res.status(500).json({ ok:false, message: err2.message || "Server error" });
    }
  });
}
