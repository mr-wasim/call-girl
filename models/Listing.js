// models/Listing.js
import mongoose from 'mongoose'

const ListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  age: String,
  price: String,
  description: String,
  profileImages: [String], // URLs like /uploads/profile/abcd.webp
  variantImages: [String],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
