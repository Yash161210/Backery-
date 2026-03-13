const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    flavor: { type: String, default: "" },
    weight: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    status: { type: String, enum: ["new", "confirmed", "baking", "ready", "delivered", "cancelled"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

