const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

// Protected route example
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});

module.exports = router;
