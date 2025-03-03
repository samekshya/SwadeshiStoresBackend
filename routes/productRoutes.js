const express = require("express");
const productController= require("../controllers/productController");
const { authenticate, restrictToAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, restrictToAdmin, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", authenticate, restrictToAdmin, productController.updateProduct);
router.delete("/:id", authenticate, restrictToAdmin, productController.deleteProduct);

module.exports = router;
