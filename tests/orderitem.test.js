const SequelizeMock = require("sequelize-mock");

// Create a mocked database connection
const dbMock = new SequelizeMock();

// Define a mock Order model
const OrderMock = dbMock.define("Order", {
  id: 1,
  userId: 1,
  totalAmount: 599.99,
  status: "paid",
});

// Define a mock Product model
const ProductMock = dbMock.define("Product", {
  id: 1,
  name: "Gaming Laptop",
  description: "A high-end gaming laptop",
  price: 1299.99,
  stock: 5,
  imageUrl: "laptop.jpg",
});

// Define a mock OrderItem model with associations
const OrderItemMock = dbMock.define("OrderItem", {
  id: 1,
  orderId: 1, // Foreign key reference to Order
  productId: 1, // Foreign key reference to Product
  quantity: 2,
  price: 1299.99,
});

// Simulate associations (Many-to-One: OrderItem → Order, Product)
OrderItemMock.belongsTo(OrderMock, { foreignKey: "orderId" });
OrderItemMock.belongsTo(ProductMock, { foreignKey: "productId" });
OrderMock.hasMany(OrderItemMock, { foreignKey: "orderId" });
ProductMock.hasMany(OrderItemMock, { foreignKey: "productId" });

describe("OrderItem Model", () => {
  it("should create an order item with valid details", async () => {
    const orderItem = await OrderItemMock.create({
      orderId: 1,
      productId: 1,
      quantity: 3,
      price: 1299.99,
    });

    expect(orderItem.orderId).toBe(1);
    expect(orderItem.productId).toBe(1);
    expect(orderItem.quantity).toBe(3);
    expect(orderItem.price).toBe(1299.99);
  });

  it("should require orderId, productId, quantity, and price", async () => {
    await expect(OrderItemMock.create({})).rejects.toThrow();
  });

  it("should default quantity to 1 if not provided", async () => {
    const orderItem = await OrderItemMock.create({
      orderId: 1,
      productId: 1,
      price: 1299.99,
    });

    expect(orderItem.quantity).toBe(1);
  });

  it("should associate an order item with an order", async () => {
    const order = await OrderMock.create({
      userId: 1,
      totalAmount: 799.99,
      status: "shipped",
    });

    const orderItem = await OrderItemMock.create({
      orderId: order.id,
      productId: 1,
      quantity: 2,
      price: 1299.99,
    });

    expect(orderItem.orderId).toBe(order.id);
  });

  it("should associate an order item with a product", async () => {
    const product = await ProductMock.create({
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      price: 49.99,
      stock: 50,
      imageUrl: "mouse.jpg",
    });

    const orderItem = await OrderItemMock.create({
      orderId: 1,
      productId: product.id,
      quantity: 5,
      price: 49.99,
    });

    expect(orderItem.productId).toBe(product.id);
  });
});
