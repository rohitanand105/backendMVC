const userService = require('../services/userService');  // Adjust the path to the service file

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by userId
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const newUser = await userService.addUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await userService.updateUser(userId, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
