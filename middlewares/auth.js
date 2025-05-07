const jwt = require("jsonwebtoken");
const config = require("../config/index");

const tokenAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const authToken = authHeader && authHeader.split(" ")[1];

  if (!authToken) {
    return res.status(401).send("Access Denied");
  }

  jwt.verify(authToken, config.jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).send("Unauthorized");
    } else {
      req.user = decoded; // Store decoded user info in request
      next();
    }
  });
};

const adminAuth = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send("Access Denied. Admin privileges required.");
  }
  next();
};

module.exports = {
  tokenAuth,
  adminAuth
};
