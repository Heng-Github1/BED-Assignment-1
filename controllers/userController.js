const User = require("../models/users");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Database query error", error: err });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.getUserById(userID);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database query error", error: err });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await User.createUser(userData);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Database query error", error: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const success = await User.deleteUser(userID);
    if (success) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database query error", error: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const userData = req.body;
    const updatedUser = await User.updateUser(userID, userData);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database query error", error: err });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
};
