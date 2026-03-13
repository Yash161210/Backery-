const express = require("express");
const GalleryImage = require("../models/GalleryImage");
const { requireAuth, requireOwner } = require("../middleware/auth");
const { upload } = require("../utils/upload");

const router = express.Router();

function absoluteImageUrl(req, relativeOrAbsolute) {
  if (!relativeOrAbsolute) return "";
  if (String(relativeOrAbsolute).startsWith("http")) return relativeOrAbsolute;
  const base = process.env.PUBLIC_API_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}${relativeOrAbsolute.startsWith("/") ? "" : "/"}${relativeOrAbsolute}`;
}

router.get("/", async (req, res, next) => {
  try {
    const images = await GalleryImage.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json({ images: images.map((i) => ({ ...i, imageUrl: absoluteImageUrl(req, i.imageUrl) })) });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth, requireOwner, async (req, res, next) => {
  try {
    const { title, category, imageUrl } = req.body || {};
    if (!imageUrl) return res.status(400).json({ message: "imageUrl required" });
    const doc = await GalleryImage.create({
      title: String(title || ""),
      category: String(category || "cakes"),
      imageUrl: String(imageUrl),
      isActive: true,
    });
    return res.status(201).json({ image: doc });
  } catch (e) {
    next(e);
  }
});

router.post("/upload", requireAuth, requireOwner, upload.single("image"), async (req, res, next) => {
  try {
    const rel = `/uploads/${req.file.filename}`;
    const doc = await GalleryImage.create({
      title: String(req.body?.title || ""),
      category: String(req.body?.category || "cakes"),
      imageUrl: rel,
      isActive: true,
    });
    return res.status(201).json({ image: { ...doc.toObject(), imageUrl: absoluteImageUrl(req, rel) } });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth, requireOwner, async (req, res, next) => {
  try {
    const doc = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

