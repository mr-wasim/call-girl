// models/City.js
import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  descriptionHtml: { type: String, default: "" }, // admin rich HTML
  createdBy: { type: String, default: "admin" },
}, { timestamps: true });

export default mongoose.models.City || mongoose.model("City", CitySchema);
