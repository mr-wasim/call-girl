// pages/api/listings/[id].js
import dbConnect from '../../../lib/db'
import Listing from '../../../models/Listing'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  // ❗ ALWAYS RETURN JSON
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      })
    }

    const { id } = req.query

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing listing id'
      })
    }

    // ✅ SAFE ObjectId check
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing id'
      })
    }

    await dbConnect()

    const listing = await Listing.findById(id).lean()

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      })
    }

    // ✅ normalize arrays
    listing.profileImages = Array.isArray(listing.profileImages)
      ? listing.profileImages
      : []

    listing.variantImages = Array.isArray(listing.variantImages)
      ? listing.variantImages
      : []

    return res.status(200).json({
      success: true,
      data: listing
    })
  } catch (err) {
    console.error('API /listings/[id] ERROR:', err)

    // ❗ ALWAYS JSON (no HTML)
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}
