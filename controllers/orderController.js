const Order = require("../models/Orders");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Create an order from cart
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart items
    const cartItems = await Cart.findAll({ where: { userId }, include: Product });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + item.Product.price * item.quantity, 0);

    // Create order
    const order = await Order.create({ userId, totalAmount, status: "pending" });

    // Create order items
    const orderItems = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    // Clear cart after ordering
    await Cart.destroy({ where: { userId } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get orders for a user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [{ model: Product, attributes: ["name", "price", "imageUrl"] }] }],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [{ model: Product, attributes: ["name", "price"] }] }],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {updateOrderStatus, getAllOrders, getUserOrders, createOrder}