// pages/api/listings/index.js
import dbConnect from '../../../lib/db'
import Listing from '../../../models/Listing'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // parse query params
    const page = Math.max(1, parseInt(req.query.page || '1', 10))
    const limit = Math.max(1, parseInt(req.query.limit || '25', 10))

    const skip = (page - 1) * limit

    // total count
    const totalItems = await Listing.countDocuments({})
    const totalPages = Math.ceil(totalItems / limit)

    // fetch page
    const data = await Listing.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // ensure arrays present
    const normalized = data.map(d => ({
      ...d,
      profileImages: Array.isArray(d.profileImages) ? d.profileImages : [],
      variantImages: Array.isArray(d.variantImages) ? d.variantImages : []
    }))

    res.status(200).json({
      success: true,
      data: normalized,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems
      }
    })
  } catch (err) {
    console.error('FETCH LISTINGS ERROR:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: err.message
    })
  }
}
