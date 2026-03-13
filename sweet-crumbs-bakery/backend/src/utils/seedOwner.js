const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function ensureOwnerUser() {
  const email = (process.env.OWNER_EMAIL || "owner@sweetcrumbs.com").toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  if (!password) {
    throw new Error("Missing OWNER_PASSWORD (set a strong password in backend/.env)");
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, role: "owner" });
}

module.exports = { ensureOwnerUser };

