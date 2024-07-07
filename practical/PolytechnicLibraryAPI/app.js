/*const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

// Connect to the database
sql.connect(dbConfig).catch(err => console.error('Database connection failed:', err));

// User registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userExists = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
        if (userExists.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await sql.query`INSERT INTO Users (username, passwordHash, role) VALUES (${username}, ${hashedPassword}, ${role})`;
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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
});*/

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

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware
app.post("/register", validateUser, usersController.registerUser);
app.post("/login", validateUser, usersController.loginUser);

//Routes for GET requests
app.get("/books", booksController.getAllBooks);

//Routes for POST requests
app.post("/books", auth.verifyJWT, validateBook, booksController.createBook);
//Routes for PUT requests
app.put("/books/:bookId/availability", auth.verifyJWT,validateBook, booksController.updateBookAvailability);


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

// Close the connection pool on SIGINT signal
// Usually sent when you terminate the application using Ctrl+C
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});