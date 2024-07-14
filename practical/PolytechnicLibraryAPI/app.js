require('dotenv').config(); // Ensure this is at the very top

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController");
const dbConfig = require("./dbConfig"); // Import dbConfig from dbConfig.js
const auth = require("./middlewares/auth");

// Import middleware
const validateBook = require("./middlewares/validateBook"); 
const validateUser = require("./middlewares/validateUser");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Middleware to serve static files from the public directory
const staticMiddleware = express.static("public");
app.use(staticMiddleware); // Mount the static middleware

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

// Routes for POST requests
app.post("/register", validateUser, usersController.registerUser);
app.post("/login", validateUser, usersController.loginUser);

// Routes for GET requests
app.get("/books", auth, booksController.getAllBooks);

// Routes for POST requests
app.post("/books", auth, validateBook, booksController.createBook);

// Routes for PUT requests
app.put("/books/:bookId/availability", auth, validateBook, booksController.updateBookAvailability);

// Start the server
app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig); // Establish a connection to the database using the configuration details in dbConfig
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
// Usually sent when you terminate the application using Ctrl+C
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
