const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectDb } = require("./utils/db");
const { ensureOwnerUser } = require("./utils/seedOwner");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const galleryRoutes = require("./routes/gallery");
const aiRoutes = require("./routes/ai");
const contactRoutes = require("./routes/contact");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

// Local upload serving (for dev / optional prod)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (_req, res) => res.json({ ok: true, name: "sweet-crumbs-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDb(process.env.MONGODB_URI);
  await ensureOwnerUser();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on :${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

