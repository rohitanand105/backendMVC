const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/get", userController.getUser);
router.put("/update", userController.updateUser);

module.exports = router;
