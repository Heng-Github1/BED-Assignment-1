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

const app = express();
app.use(bodyParser.json());

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
});

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));