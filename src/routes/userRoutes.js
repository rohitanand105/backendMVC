const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/get-user", userController.getUser);
router.put("/update", userController.updateUser);
router.delete("/delete", userController.deleteUser);

module.exports = router;
