const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // User ID from authentication middleware

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get cart items for a user
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, attributes: ["name", "price", "imageUrl"] }],
    });

    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findByPk(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Clear all cart items for a user
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.destroy({ where: { userId } });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {clearCart, removeFromCart, updateCartItem, getCartItems, addToCart}