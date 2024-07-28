// Import required modules
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating and verifying JWTs
const User = require('../models/users'); // User model for database operations
require('dotenv').config(); // Load environment variables from .env file

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * Register a new user
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(null, username, email, hashedPassword, role, new Date(), new Date());
    // Create new user
    const createdUser = await User.createUser(newUser);

    // Generate a JWT token
    const token = jwt.sign({ id: createdUser.userID, role: createdUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token }); // Include token in the response
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Login a user
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      console.log('User not found:', username); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for user:', username); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate a JWT token
    const token = jwt.sign({ id: user.userID, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('User logged in successfully:', username); // Debug log
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get user profile
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
const getUserProfile = async (req, res) => {
  const userId = req.user.id;  // Assuming req.user is set by auth middleware
  console.log("User ID from token:", userId); // Debug log
  try {
    // Fetch user by ID
    const user = await User.getUserById(userId);
    if (!user) {
      console.log("User not found in database"); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all users
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a user by ID
 * @swagger
 * /users/{userID}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const getUserById = async (req, res) => {
  const { userID } = req.params;
  try {
    // Fetch user by ID
    const user = await User.getUserById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new user
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    // Create a new user
    const createdUser = await User.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a user by ID
 * @swagger
 * /users/{userID}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const updateUser = async (req, res) => {
  const { userID } = req.params;
  const newUser = req.body;
  try {
    // Fetch existing user by ID
    const existingUser = await User.getUserById(userID);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare updated data
    const updatedData = {
      username: newUser.username || existingUser.username,
      email: newUser.email || existingUser.email,
      password: newUser.password || existingUser.password,
      role: newUser.role || existingUser.role,
      userCreated: existingUser.userCreated,
      userModified: new Date()
    };

    // Update user data
    const updatedUser = await User.updateUser(userID, updatedData);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a user by ID
 * @swagger
 * /users/{userID}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const deleteUser = async (req, res) => {
  const { userID } = req.params;
  try {
    // Delete user by ID
    const success = await User.deleteUser(userID);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reset user password
 * @swagger
 * /users/reset-password:
 *   patch:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedData = {
      ...user, // Spread the existing user data
      password: hashedPassword,
      userModified: new Date()
    };

    // Update user password
    await User.updateUser(user.userID, updatedData);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
};
