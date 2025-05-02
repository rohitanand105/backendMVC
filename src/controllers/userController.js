const { getRepository } = require("typeorm");
const Account = require("../entities/Account");
const User = require("../entities/User");

// ✅ Get user details by username
exports.getUser = async (req, res) => {
  const { username } = req.body;
  const accountRepo = getRepository(Account);

  try {
    const account = await accountRepo.findOne({ where: { username }, relations: ["user"] });
    if (!account) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: account.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve user", error: err.message });
  }
};

// ✅ Update user details by userId
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
