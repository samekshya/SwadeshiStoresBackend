const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { authenticate, restrictToAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes (Accessible to all users)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private Route (Only logged-in users can access)
router.get("/profile", authenticate, getUserProfile);

// Admin-only Route (Only admins can access)
router.get("/admin/users", authenticate, restrictToAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
