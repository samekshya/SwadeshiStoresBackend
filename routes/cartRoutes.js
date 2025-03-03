const express = require("express");
const  cartController= require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", authenticate, cartController.addToCart);
router.get("/", authenticate, cartController.getCartItems);
router.put("/:id", authenticate, cartController.updateCartItem);
router.delete("/:id", authenticate, cartController.removeFromCart);
router.delete("/", authenticate, cartController.clearCart);

module.exports = router;
