const { getRepository } = require('typeorm');
const User = require('../entities/User');  // Adjust the path as per your project structure

// Get all users
exports.getAllUsers = async () => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    return users;
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

// Get a user by userId
exports.getUserById = async (userId) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

// Add a new user
exports.addUser = async (data) => {
  try {
    const userRepository = getRepository(User);
    const newUser = userRepository.create(data);  // Automatically maps the object to entity
    await userRepository.save(newUser);
    return newUser;
  } catch (error) {
    throw new Error('Error adding user: ' + error.message);
  }
};

// Update an existing user
exports.updateUser = async (userId, data) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }
    // Update fields
    userRepository.merge(user, data);
    await userRepository.save(user);
    return user;
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};
