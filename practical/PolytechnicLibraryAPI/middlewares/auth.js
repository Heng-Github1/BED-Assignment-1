const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Forbidden" });
    }

    // Authorization for different roles
    const authorizedRoles = {
      "/books": ["member", "librarian"], 
      "/books/[0-9]+/availability": ["librarian"], 
    };

    const requestedEndpoint = req.url;
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(([endpoint, roles]) => {
      const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
      return regex.test(requestedEndpoint) && roles.includes(userRole);
    });

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; 
    next();
  });
}

module.exports = verifyJWT;