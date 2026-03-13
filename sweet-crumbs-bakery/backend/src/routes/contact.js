const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { requireAuth, requireOwner } = require("../middleware/auth");

const router = express.Router();

// Public: submit contact form
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !message) return res.status(400).json({ message: "name and message are required" });
    const doc = await ContactMessage.create({
      name: String(name),
      email: String(email || ""),
      phone: String(phone || ""),
      message: String(message),
    });
    return res.status(201).json({ ok: true, id: String(doc._id) });
  } catch (e) {
    next(e);
  }
});

// Owner: list messages
router.get("/", requireAuth, requireOwner, async (_req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return res.json({ messages });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

