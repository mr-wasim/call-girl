// pages/api/admin/cities.js
import mongoose from "mongoose";
import City from "../../../models/City";

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

function slugify(s){
  return s.toString().toLowerCase().trim().replace(/[\s\W-]+/g,'-').replace(/^-+|-+$/g,'')
}

export default async function handler(req,res){
  try{
    await connect();

    if (req.method === "GET") {
      const cities = await City.find({}).sort({ name: 1 }).lean();
      return res.status(200).json({ ok: true, cities });
    }

    if (req.method === "POST") {
      const { name, descriptionHtml } = req.body || {};
      if (!name || !name.trim()) return res.status(400).json({ ok:false, message: "City name required" });
      const slug = slugify(name);
      let finalSlug = slug, counter = 1;
      while (await City.findOne({ slug: finalSlug })) finalSlug = `${slug}-${counter++}`;
      const c = new City({ name: name.trim(), slug: finalSlug, descriptionHtml: descriptionHtml || "" });
      await c.save();
      return res.status(201).json({ ok:true, city: c });
    }

    res.setHeader("Allow", ["GET","POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("[/api/admin/cities] error:", err);
    return res.status(500).json({ ok:false, message: err.message });
  }
}
