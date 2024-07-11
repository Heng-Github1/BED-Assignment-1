<<<<<<< HEAD
require('dotenv').config(); // Ensure this is at the very top

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
=======
const express = require("express");
const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); //Import body-parser
const auth = require("./middlewares/auth");

//import middleware
const validateBook = require("./middlewares/validateBook"); 
const validateUser = require("./middlewares/validateUser"); 
>>>>>>> 7df75364d261085b42ed7501b29357f8e7511021

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

<<<<<<< HEAD
// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
=======
app.use(staticMiddleware); // Mount the static middleware
app.post("/register", validateUser, usersController.registerUser);
app.post("/login", validateUser, usersController.loginUser);
>>>>>>> 7df75364d261085b42ed7501b29357f8e7511021

//Routes for GET requests
app.get("/books", booksController.getAllBooks);

//Routes for POST requests
app.post("/books", auth, validateBook, booksController.createBook);
//Routes for PUT requests
app.put("/books/:bookId/availability", auth,validateBook, booksController.updateBookAvailability);


app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig); //Establish a connection to the database using the configuration details in dbConfig
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

<<<<<<< HEAD
// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
        if (userResult.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.recordset[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user.user_id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all books
app.get('/books', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Books`;
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update book availability
app.put('/books/:bookId/availability', async (req, res) => {
    const { bookId } = req.params;
    const { availability } = req.body;

    try {
        await sql.query`UPDATE Books SET availability = ${availability} WHERE book_id = ${bookId}`;
        res.status(200).json({ message: 'Book availability updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
=======
// Close the connection pool on SIGINT signal
// Usually sent when you terminate the application using Ctrl+C
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
>>>>>>> 7df75364d261085b42ed7501b29357f8e7511021
