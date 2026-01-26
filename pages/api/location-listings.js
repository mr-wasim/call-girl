import dbConnect from "../../lib/db"
import Listing from "../../models/Listing"

// 🔑 SAME NORMALIZATION EVERYWHERE
function normalizeCity(str = "") {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false })
  }

  const { city } = req.query
  if (!city) {
    return res.status(400).json({ success: false, message: "city required" })
  }

  try {
    await dbConnect()

    const inputSlug = normalizeCity(city)

    // ⬇️ DB se sab listings lao
    const all = await Listing.find({}).lean()

    // ⬇️ JS level pe exact normalized match
    const matched = all.filter(item => {
      if (!item.city) return false
      const dbSlug = normalizeCity(item.city)
      return dbSlug === inputSlug
    })

    if (!matched.length) {
      return res.status(200).json({
        success: false,
        message: "NO_DATA",
        debug: {
          inputSlug,
          available: all.map(i => i.city)
        }
      })
    }

    return res.status(200).json({
      success: true,
      data: matched
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false })
  }
}
