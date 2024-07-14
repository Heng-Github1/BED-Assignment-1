const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware function to verify JWT token and authorize user roles
function verifyJWT(req, res, next) {
  // Extract token from Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Forbidden" });
    }

    // Define authorized roles for each endpoint
    const authorizedRoles = {
      "/books": ["member", "librarian"],
      "/books/[0-9]+/availability": ["librarian"],
    };

    const requestedEndpoint = req.url;
    const userRole = decoded.role;

    // Check if the user's role is authorized to access the requested endpoint
    const authorizedRole = Object.entries(authorizedRoles).find(([endpoint, roles]) => {
      const regex = new RegExp(`^${endpoint}$`);
      return regex.test(requestedEndpoint) && roles.includes(userRole);
    });

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Attach decoded user information to the request object
    req.user = decoded;
    next();
  });
}

module.exports = verifyJWT;
