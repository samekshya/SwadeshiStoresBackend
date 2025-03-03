const express = require("express");
const orderController= require("../controllers/orderController");
const { authenticate, restrictToAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, orderController.createOrder);
router.get("/", authenticate, orderController.getUserOrders);
router.get("/admin", authenticate, restrictToAdmin, orderController.getAllOrders);
router.put("/:id", authenticate, restrictToAdmin, orderController.updateOrderStatus);

module.exports = router;
