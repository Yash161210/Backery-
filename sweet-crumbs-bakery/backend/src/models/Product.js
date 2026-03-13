const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    flavor: { type: String, default: "" },
    category: { type: String, default: "Cake" },
    weightOptions: [{ type: String }],
    imageUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

