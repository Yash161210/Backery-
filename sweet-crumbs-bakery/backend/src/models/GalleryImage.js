const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    category: { type: String, default: "cakes" },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);

