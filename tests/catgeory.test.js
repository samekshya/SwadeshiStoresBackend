const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

const CategoryMock = dbMock.define("Category", {
  id: 1,
  name: "Electronics",
  description: "Electronic gadgets and accessories",
});

describe("Category Model", () => {
  it("should create a category with valid details", async () => {
    const category = await CategoryMock.create({
      name: "Fashion",
      description: "Clothing and accessories",
    });

    expect(category.name).toBe("Fashion");
    expect(category.description).toBe("Clothing and accessories");
  });

  it("should require name", async () => {
    await expect(CategoryMock.create({})).rejects.toThrow();
  });

  it("should ensure name is unique", async () => {
    await CategoryMock.create({
      name: "Home Appliances",
      description: "Appliances for home use",
    });

    await expect(
      CategoryMock.create({
        name: "Home Appliances", 
        description: "Another home category",
      })
    ).rejects.toThrow();
  });

  it("should allow description to be optional", async () => {
    const category = await CategoryMock.create({
      name: "Sports",
    });

    expect(category.name).toBe("Sports");
    expect(category.description).toBeNull(); 
  });
});
