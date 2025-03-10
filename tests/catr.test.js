const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();


const UserMock = dbMock.define("User", {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
});


const ProductMock = dbMock.define("Product", {
  id: 1,
  name: "Smartphone",
  description: "A high-end smartphone",
  price: 699.99,
  stock: 50,
  imageUrl: "smartphone.jpg",
});


const CartMock = dbMock.define("Cart", {
  id: 1,
  userId: 1, 
  productId: 1, 
  quantity: 2,
});


CartMock.belongsTo(UserMock, { foreignKey: "userId" });
CartMock.belongsTo(ProductMock, { foreignKey: "productId" });
UserMock.hasMany(CartMock, { foreignKey: "userId" });
ProductMock.hasMany(CartMock, { foreignKey: "productId" });

describe("Cart Model", () => {
  it("should create a cart item with valid details", async () => {
    const cartItem = await CartMock.create({
      userId: 1,
      productId: 1,
      quantity: 3,
    });

    expect(cartItem.userId).toBe(1);
    expect(cartItem.productId).toBe(1);
    expect(cartItem.quantity).toBe(3);
  });

  it("should require userId, productId, and quantity", async () => {
    await expect(CartMock.create({})).rejects.toThrow();
  });

  it("should default quantity to 1 if not provided", async () => {
    const cartItem = await CartMock.create({
      userId: 1,
      productId: 1,
    });

    expect(cartItem.quantity).toBe(1);
  });

  it("should associate a cart item with a user", async () => {
    const user = await UserMock.create({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass",
    });

    const cartItem = await CartMock.create({
      userId: user.id,
      productId: 1,
      quantity: 2,
    });

    expect(cartItem.userId).toBe(user.id);
  });

  it("should associate a cart item with a product", async () => {
    const product = await ProductMock.create({
      name: "Wireless Keyboard",
      description: "Mechanical wireless keyboard",
      price: 99.99,
      stock: 20,
      imageUrl: "keyboard.jpg",
    });

    const cartItem = await CartMock.create({
      userId: 1,
      productId: product.id,
      quantity: 5,
    });

    expect(cartItem.productId).toBe(product.id);
  });
});

