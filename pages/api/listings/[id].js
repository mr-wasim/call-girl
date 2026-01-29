// pages/api/listings/[id].js
import dbConnect from '../../../lib/db'
import Listing from '../../../models/Listing'
import mongoose from 'mongoose'

/**
 * Supports:
 *  GET    /api/listings/:id    -> returns listing
 *  PUT    /api/listings/:id    -> updates listing (whitelist fields)
 *  DELETE /api/listings/:id    -> deletes listing
 *
 * Always returns JSON { success: boolean, data?: ..., message?: ... }
 */

export default async function handler(req, res) {
  try {
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

    /* ------------------ GET ------------------ */
    if (req.method === 'GET') {
      const listing = await Listing.findById(id).lean()

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        })
      }

      // normalize arrays
      listing.profileImages = Array.isArray(listing.profileImages) ? listing.profileImages : []
      listing.variantImages = Array.isArray(listing.variantImages) ? listing.variantImages : []

      return res.status(200).json({
        success: true,
        data: listing
      })
    }

    /* ------------------ PUT (update) ------------------ */
    if (req.method === 'PUT') {
      // whitelist fields that are allowed to be updated from admin popup
      const allowed = [
        'name',
        'city',
        'citySlug',
        'price',
        'description',
        'descriptionHtml',
        'profileImages',
        'variantImages',
        'status',
        'meta',
      ]

      const body = req.body || {}
      const update = {}

      // copy only allowed fields
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          update[key] = body[key]
        }
      }

      // normalize arrays if present
      if (update.profileImages && !Array.isArray(update.profileImages)) {
        update.profileImages = typeof update.profileImages === 'string' && update.profileImages.length
          ? [update.profileImages]
          : []
      }
      if (update.variantImages && !Array.isArray(update.variantImages)) {
        update.variantImages = typeof update.variantImages === 'string' && update.variantImages.length
          ? [update.variantImages]
          : []
      }

      // optional: coerce price to number if provided
      if (update.price !== undefined && update.price !== null && update.price !== '') {
        const num = Number(update.price)
        update.price = Number.isFinite(num) ? num : update.price
      }

      // perform update
      const updated = await Listing.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      }).lean()

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found for update'
        })
      }

      // normalize arrays on updated doc
      updated.profileImages = Array.isArray(updated.profileImages) ? updated.profileImages : []
      updated.variantImages = Array.isArray(updated.variantImages) ? updated.variantImages : []

      return res.status(200).json({
        success: true,
        data: updated
      })
    }

    /* ------------------ DELETE ------------------ */
    if (req.method === 'DELETE') {
      const deleted = await Listing.findByIdAndDelete(id).lean()

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found for delete'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Listing deleted'
      })
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  } catch (err) {
    console.error('API /listings/[id] ERROR:', err)
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}
