const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getRepository } = require("typeorm");
const User = require("../entities/User");
const Account = require("../entities/Account");

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

exports.register = async (req, res) => {
  const userRepo = getRepository(User);
  const accountRepo = getRepository(Account);

  const {
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    aadharCard,
    age,
    dob,
    address
  } = req.body;

  try {
    const existing = await accountRepo.findOne({ where: { username } });
    if (existing) return res.status(400).json({ success: false, message: "Username already exists" });

    const newUser = userRepo.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      aadharCard,
      age,
      dob,
      address
    });
    const savedUser = await userRepo.save(newUser);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = accountRepo.create({
      username,
      password: hashedPassword,
      user: savedUser
    });

    await accountRepo.save(newAccount);
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const accountRepo = getRepository(Account);

  try {
    const account = await accountRepo.findOne({ where: { username }, relations: ["user"] });
    if (!account || !account.isActive) return res.status(401).json({ success: false, message: "Unauthorized" });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: account.user.userId, username }, JWT_SECRET, { expiresIn: "1h" });
    account.token = token;
    await accountRepo.save(account);

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const { username } = req.body;
  const accountRepo = getRepository(Account);

  try {
    const account = await accountRepo.findOne({ where: { username }, relations: ["user"] });
    if (!account) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: account.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId, ...updates } = req.body;
  const userRepo = getRepository(User);

  try {
    await userRepo.update({ userId }, updates);
    const updated = await userRepo.findOne({ where: { userId } });
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { username } = req.body;
  const accountRepo = getRepository(Account);

  try {
    const account = await accountRepo.findOne({ where: { username } });
    if (!account) return res.status(404).json({ success: false, message: "Account not found" });

    account.isActive = false;
    await accountRepo.save(account);
    res.json({ success: true, message: "User deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: err.message });
  }
};
