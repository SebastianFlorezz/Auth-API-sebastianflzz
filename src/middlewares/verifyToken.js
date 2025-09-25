const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // we verify if the header exist
  if (!authHeader) {
    return res.status(401).json({
      errors: [{
        status: 401,
        title: "Unauthorized",
        detail: "Authorization header missing",
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.requestId
        }
      }]
    });
  }

  const token = authHeader.split(" ")[1]; // removing bearer
  if (!token) {
    return res.status(401).json({
      errors: [{
        status: 401,
        title: "Unauthorized",
        detail: "Token not provided",
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.requestId
        }
      }]
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      errors: [{
        status: 401,
        title: "Unauthorized",
        detail: "Invalid or expired token",
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.requestId
        }
      }]
    });
  }
}

module.exports = authMiddleware;