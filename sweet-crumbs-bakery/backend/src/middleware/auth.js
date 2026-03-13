const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing token" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireOwner(req, res, next) {
  if (req.user?.role !== "owner") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
}

module.exports = { requireAuth, requireOwner };

