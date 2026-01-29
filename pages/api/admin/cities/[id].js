// pages/api/admin/cities/[id].js
import mongoose from "mongoose";
import City from "../../../../models/City";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

let cached = global._mongooseConnection || null;
if (!cached) cached = global._mongooseConnection = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("Please set MONGODB_URI or MONGO_URI");
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

function slugify(s){
  return s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

export default async function handler(req,res){
  const { id } = req.query;

  try{
    await connect();

    // ========= UPDATE =========
    if (req.method === "PUT") {
      const { name, descriptionHtml } = req.body || {};
      if (!name || !name.trim()) {
        return res.status(400).json({ ok:false, message:"City name required" });
      }

      const baseSlug = slugify(name);
      let finalSlug = baseSlug;
      let counter = 1;

      // unique slug (excluding current city)
      while (await City.findOne({ slug: finalSlug, _id: { $ne: id } })) {
        finalSlug = `${baseSlug}-${counter++}`;
      }

      const city = await City.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          slug: finalSlug,
          descriptionHtml: descriptionHtml || "",
        },
        { new: true }
      );

      if (!city) {
        return res.status(404).json({ ok:false, message:"City not found" });
      }

      // 👉 yahan se agar kisi aur collection me city reference ho
      // example:
      // await Place.updateMany({ city: id }, { citySlug: city.slug, cityName: city.name });

      return res.json({ ok:true, city });
    }

    // ========= DELETE (GLOBAL DELETE) =========
    if (req.method === "DELETE") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const city = await City.findById(id).session(session);
        if (!city) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ ok:false, message:"City not found" });
        }

        // ❌ delete city
        await City.deleteOne({ _id: id }).session(session);

        // 🔥 DELETE / CLEAN FROM OTHER COLLECTIONS
        // example:
        // await Place.deleteMany({ city: id }).session(session);
        // await Job.deleteMany({ city: id }).session(session);
        // OR
        // await Place.updateMany({ city: id }, { $unset:{ city:\"\" } }).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.json({ ok:true, message:"City deleted everywhere" });
      } catch (e) {
        await session.abortTransaction();
        session.endSession();
        throw e;
      }
    }

    res.setHeader("Allow", ["PUT","DELETE"]);
    return res.status(405).end();
  } catch (err) {
    console.error("[/api/admin/cities/:id] error:", err);
    return res.status(500).json({ ok:false, message: err.message });
  }
}
