const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { authenticate, restrictToAdmin } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);


router.get("/profile", authenticate, getUserProfile);


router.get("/admin/users", authenticate, restrictToAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
