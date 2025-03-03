const SequelizeMock = require("sequelize-mock");

// Create a mocked database connection
const dbMock = new SequelizeMock();

// Define a mock User model
const UserMock = dbMock.define("User", {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
});

// Define a mock Order model with association to User
const OrderMock = dbMock.define("Order", {
  id: 1,
  userId: 1, // Foreign key reference to User
  totalAmount: 299.99,
  status: "pending",
});

// Simulate association (One-to-Many: User → Orders)
OrderMock.belongsTo(UserMock, { foreignKey: "userId" });
UserMock.hasMany(OrderMock, { foreignKey: "userId" });

describe("Order Model", () => {
  it("should create an order with valid details", async () => {
    const order = await OrderMock.create({
      userId: 1,
      totalAmount: 599.99,
      status: "paid",
    });

    expect(order.userId).toBe(1);
    expect(order.totalAmount).toBe(599.99);
    expect(order.status).toBe("paid");
  });

  it("should require userId and totalAmount", async () => {
    await expect(OrderMock.create({})).rejects.toThrow();
  });

  it("should default status to 'pending' if not provided", async () => {
    const order = await OrderMock.create({
      userId: 1,
      totalAmount: 199.99,
    });

    expect(order.status).toBe("pending");
  });

  it("should associate an order with a user", async () => {
    const user = await UserMock.create({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass",
    });

    const order = await OrderMock.create({
      userId: user.id,
      totalAmount: 450.0,
      status: "shipped",
    });

    expect(order.userId).toBe(user.id);
  });
});
