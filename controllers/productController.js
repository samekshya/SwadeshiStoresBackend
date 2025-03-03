const Product = require("../models/Product");
const Category = require("../models/Category");

// Create a new product with image upload
const createProduct = async (req, res) => {
    try {
      const { name, description, price, stock, categoryId } = req.body;
      
      // Check if category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
  
      // Handle image upload
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
      const product = await Product.create({ name, description, price, stock, imageUrl, categoryId });
  
      res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: [{ model: Category, attributes: ["name"] }] });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["name"] }],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a product
 const updateProduct = async (req, res) => {
    try {
      const { name, description, price, stock, categoryId } = req.body;
      const product = await Product.findByPk(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(400).json({ message: "Category not found" });
        }
      }
  
      // Handle image update
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : product.imageUrl;
  
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.imageUrl = imageUrl;
      product.categoryId = categoryId || product.categoryId;
  
      await product.save();
      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {deleteProduct, updateProduct, getProductById, getAllProducts, createProduct}