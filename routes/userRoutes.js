const express = require("express");
const userController = require("../controllers/userController");
const { tokenAuth, adminAuth } = require("../middlewares/auth");

const router = express.Router();

// Admin only routes
router.post("/signup", tokenAuth, adminAuth, userController.signup);
router.get("/all", tokenAuth, adminAuth, userController.getAllUsers);
router.delete("/:userId", tokenAuth, adminAuth, userController.deleteUser);

// Public route
router.post("/signin", userController.signin);

module.exports = router;
