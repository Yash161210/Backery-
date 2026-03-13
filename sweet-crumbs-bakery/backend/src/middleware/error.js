function notFound(req, res, _next) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  const status = Number(err.statusCode) || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };

