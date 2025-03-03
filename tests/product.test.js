const SequelizeMock = require("sequelize-mock");

// Create a mocked database connection
const dbMock = new SequelizeMock();

// Define a mock Category model
const CategoryMock = dbMock.define("Category", {
  id: 1,
  name: "Electronics",
});

// Define a mock Product model with association to Category
const ProductMock = dbMock.define("Product", {
  id: 1,
  name: "Smartphone",
  description: "A high-end smartphone",
  price: 699.99,
  stock: 50,
  imageUrl: "smartphone.jpg",
  categoryId: 1, // Foreign key reference to Category
});

// Simulate association (One-to-Many: Category → Products)
ProductMock.belongsTo(CategoryMock, { foreignKey: "categoryId" });
CategoryMock.hasMany(ProductMock, { foreignKey: "categoryId" });

describe("Product Model", () => {
  it("should create a product with valid details", async () => {
    const product = await ProductMock.create({
      name: "Laptop",
      description: "A powerful gaming laptop",
      price: 1299.99,
      stock: 10,
      imageUrl: "laptop.jpg",
      categoryId: 1,
    });

    expect(product.name).toBe("Laptop");
    expect(product.description).toBe("A powerful gaming laptop");
    expect(product.price).toBe(1299.99);
    expect(product.stock).toBe(10);
    expect(product.imageUrl).toBe("laptop.jpg");
    expect(product.categoryId).toBe(1);
  });

  it("should require name, price, stock, and categoryId", async () => {
    await expect(ProductMock.create({})).rejects.toThrow();
  });

  it("should default stock to 0 if not provided", async () => {
    const product = await ProductMock.create({
      name: "Headphones",
      description: "Wireless noise-canceling headphones",
      price: 199.99,
      imageUrl: "headphones.jpg",
      categoryId: 1,
    });

    expect(product.stock).toBe(0);
  });

  it("should associate a product with a category", async () => {
    const category = await CategoryMock.create({
      name: "Accessories",
    });

    const product = await ProductMock.create({
      name: "Mouse",
      description: "Wireless gaming mouse",
      price: 59.99,
      stock: 20,
      imageUrl: "mouse.jpg",
      categoryId: category.id,
    });

    expect(product.categoryId).toBe(category.id);
  });
});
