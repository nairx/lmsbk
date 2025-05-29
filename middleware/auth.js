// middleware/auth.js
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  // console.log(req)
  const authHeader = req.headers.authorization;
  // console.log(req.headers);
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(decoded);
    next();
  } catch (err) {
    // console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// module.exports = { authenticate, authorize };

export { authenticate, authorize };
