const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, restrictToAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, restrictToAdmin, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", authenticate, restrictToAdmin, categoryController.updateCategory);
router.delete("/:id", authenticate, restrictToAdmin, categoryController.deleteCategory);

module.exports = router;
