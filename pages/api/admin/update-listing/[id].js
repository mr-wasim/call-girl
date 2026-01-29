// pages/api/admin/update-listing/[id].js
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Listing from "../../../../models/Listing";

export const config = { api: { bodyParser: false } };

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";
let cached = global._mongooseConnection || null;
if (!cached) cached = global._mongooseConnection = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
  cached.conn = await cached.promise;
  return cached.conn;
}

function ensureUploadsDir() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

async function moveFile(file) {
  const tmp = file.filepath || file.path;
  const orig = file.originalFilename || file.name || `upload-${Date.now()}.png`;
  const ext = path.extname(orig) || ".png";
  const fn = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
  const dest = path.join(process.cwd(), "public", "uploads", fn);

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

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ ok:false, message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ ok:false, message: 'Missing id' });
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ ok:false, message: 'Invalid id' });

  await connect();
  ensureUploadsDir();

  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('form parse error', err);
        return res.status(500).json({ ok:false, message: 'Form parse failed' });
      }

      const listing = await Listing.findById(id);
      if (!listing) return res.status(404).json({ ok:false, message: 'Listing not found' });

      // update basic fields
      listing.name = fields.name ?? listing.name;
      listing.city = fields.city ?? listing.city;
      listing.price = fields.price ?? listing.price;
      listing.status = fields.status ?? listing.status;
      listing.descriptionHtml = fields.description ?? listing.descriptionHtml;

      // parse keep arrays (sent as JSON strings)
      let keepProfile = [];
      let keepVariant = [];
      try {
        if (fields.keepProfile) keepProfile = JSON.parse(fields.keepProfile);
      } catch (e) { keepProfile = [] }
      try {
        if (fields.keepVariant) keepVariant = JSON.parse(fields.keepVariant);
      } catch (e) { keepVariant = [] }

      listing.profileImages = Array.isArray(keepProfile) ? keepProfile : [];
      listing.variantImages = Array.isArray(keepVariant) ? keepVariant : [];

      // move uploaded profileImages
      if (files.profileImages) {
        const arr = Array.isArray(files.profileImages) ? files.profileImages : [files.profileImages];
        for (const f of arr) {
          const url = await moveFile(f);
          listing.profileImages.push(url);
        }
      }

      // move uploaded variantImages
      if (files.variantImages) {
        const arr = Array.isArray(files.variantImages) ? files.variantImages : [files.variantImages];
        for (const f of arr) {
          const url = await moveFile(f);
          listing.variantImages.push(url);
        }
      }

      await listing.save();

      return res.status(200).json({ ok:true, listing });
    } catch (err) {
      console.error('update-listing error', err);
      return res.status(500).json({ ok:false, message: err.message });
    }
  });
}
