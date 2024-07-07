const bcrypt = require('bcryptjs');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
//const { sql } = require('../config/db');
require ("dotenv").config();

/*async function register(req, res) {
  const { username, password, role } = req.body;

  try {
    const userCheck = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sql.query`INSERT INTO Users (username, passwordHash, role) VALUES (${username}, ${hashedPassword}, ${role})`;

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const result = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };*/

const createUser = async (req, res) => {
  const newUser = req.body;

  try {
      const createdUser = await User.createUser(newUser);
      res.status(201).json(createdUser);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error creating user");
  }
};

const getAllUsers = async (req, res) => {
  try {
      const users = await User.getAllUsers();
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
      const user = await User.getUserById(userId);
      if (!user) {
          return res.status(404).send("User not found");
      }
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.body.id);
  const newUser = req.body;
  try {
      const updatedUser = await User.updateUser(userId, newUser);
      if (!updatedUser) {
          return res.status(404).send("User not found");
      }
      res.json(updatedUser);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
      const success = await User.deleteUser(userId);
      if (!success) {
          return res.status(404).send("User not found");
      }
      res.status(204).send("User deleted");
  } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user");
  }
};

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {
      const users = await User.searchUsers(searchTerm);
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching users" });
  }
}

/*async function getUsersWithBooks(req, res) {
  try {
      const users = await User.getUsersWithBooks();
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with books" });
  }
}*/

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
      // Validate user data (you can implement your own validation logic here)
      if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required" });
      }

      // Check for existing username
      const existingUser = await User.getUserByUsername(username);
      if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user instance
      const newUser = new User(username, hashedPassword, role);

      // Save user to database
      await newUser.save();

      return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
      // Validate user input
      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
      }

      // Retrieve user from database
      const user = await User.getUserByUsername(username);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Compare hashed password with input password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token using dotenv configured JWT_SECRET
      const tokenPayload = {
          user_id: user.user_id,
          role: user.role,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return token to the client
      res.json({ token });

  } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser,
  //getUsersWithBooks,
  registerUser,
  loginUser
};

