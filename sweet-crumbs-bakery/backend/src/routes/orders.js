const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { requireAuth, requireOwner } = require("../middleware/auth");

const router = express.Router();

// Public: place order (simple COD-style)
router.post("/", async (req, res, next) => {
  try {
    const { items, customer } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Items required" });
    if (!customer?.name || !customer?.phone) return res.status(400).json({ message: "Customer name & phone required" });

    const productIds = items.map((i) => i.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const normalized = items.map((i) => {
      const p = byId.get(String(i.productId));
      if (!p) throw Object.assign(new Error("Invalid product in cart"), { statusCode: 400 });
      const qty = Math.max(1, Number(i.quantity || 1));
      return {
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: qty,
        flavor: String(i.flavor || p.flavor || ""),
        weight: String(i.weight || ""),
        imageUrl: String(p.imageUrl || ""),
      };
    });

    const subtotal = normalized.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const order = await Order.create({
      items: normalized,
      subtotal,
      customer: {
        name: String(customer.name),
        phone: String(customer.phone),
        email: String(customer.email || ""),
        address: String(customer.address || ""),
        notes: String(customer.notes || ""),
      },
    });

    return res.status(201).json({ order });
  } catch (e) {
    return next(e);
  }
});

// Owner
router.get("/", requireAuth, requireOwner, async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json({ orders });
  } catch (e) {
    return next(e);
  }
});

router.put("/:id/status", requireAuth, requireOwner, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Not found" });
    return res.json({ order });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

