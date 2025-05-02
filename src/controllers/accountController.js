const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getRepository } = require("typeorm");
const Account = require("../entities/Account");
const User = require("../entities/User");

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

exports.register = async (req, res) => {
  const accountRepo = getRepository(Account);
  const userRepo = getRepository(User);

  const {
    username, password,
    firstName, lastName, email, phoneNumber,
    aadharCard, age, dob, address
  } = req.body;

  try {
    const exists = await accountRepo.findOne({ where: { username } });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const user = userRepo.create({ firstName, lastName, email, phoneNumber, aadharCard, age, dob, address });
    const savedUser = await userRepo.save(user);

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = accountRepo.create({ username, password: hashedPassword, user: savedUser });
    await accountRepo.save(account);

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const accountRepo = getRepository(Account);

  try {
    const account = await accountRepo.findOne({ where: { username }, relations: ["user"] });
    if (!account || !account.isActive) return res.status(401).json({ message: "Unauthorized" });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: account.user.userId, username }, JWT_SECRET, { expiresIn: "1h" });
    account.token = token;
    await accountRepo.save(account);

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  const { username } = req.body;
  const accountRepo = getRepository(Account);

  try {
    const account = await accountRepo.findOne({ where: { username } });
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.isActive = false;
    await accountRepo.save(account);
    res.json({ success: true, message: "User deactivated" });
  } catch (err) {
    res.status(500).json({ message: "Deactivation failed", error: err.message });
  }
};
