const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Function to create a new user
const createUser = async (req, res) => {
  const newUser = req.body;

  try {
    // Create user in the database
    const createdUser = await User.createUser(newUser);
    // Respond with the created user
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};

// Function to retrieve all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.getAllUsers();
    // Respond with the users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

// Function to retrieve a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    // Fetch user by ID from the database
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Respond with the user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

// Function to update a user
const updateUser = async (req, res) => {
  const userId = parseInt(req.body.id);
  const newUser = req.body;
  try {
    // Update user in the database
    const updatedUser = await User.updateUser(userId, newUser);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    // Respond with the updated user
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    // Delete user from the database
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    // Respond with no content
    res.status(204).send("User deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

// Function to search users by a search term
async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm;

  try {
    // Search for users in the database
    const users = await User.searchUsers(searchTerm);
    // Respond with the users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
}

// Function to register a new user
async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    // Validate user input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User(username, hashedPassword, role);

    // Save user to the database
    await newUser.save();

    // Respond with a success message
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Function to log in a user
async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Retrieve user from the database
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the hashed password with the input password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token using the configured secret key
    const tokenPayload = {
      user_id: user.user_id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
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
  registerUser,
  loginUser
};
