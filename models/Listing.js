// models/Listing.js
import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  citySlug: { type: String, required: true }, // reference by slug
  age: { type: String },
  price: { type: String },
  descriptionHtml: { type: String, default: "" },
  profileImages: [{ type: String }], // public paths
  variantImages: [{ type: String }],
  profileOrder: [{ type: String }], // filenames in order
  createdBy: { type: String, default: "admin" },
}, { timestamps: true });

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
