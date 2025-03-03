const SequelizeMock = require("sequelize-mock");

// Create a mocked database connection
const dbMock = new SequelizeMock();


const UserMock = dbMock.define("User", {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "hashedpassword",
  role: "customer",
});

describe("User Model", () => {
  it("should create a user with valid details", async () => {
    const user = await UserMock.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      role: "customer",
    });

    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.password).toBe("securepassword");
    expect(user.role).toBe("customer");
  });

  it("should require name, email, and password", async () => {
    await expect(UserMock.create({})).rejects.toThrow();
  });

  it("should ensure email is unique", async () => {
    await UserMock.create({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass",
      role: "customer",
    });

    await expect(
      UserMock.create({
        name: "Bob",
        email: "alice@example.com", // Same email as Alice
        password: "anotherpass",
        role: "customer",
      })
    ).rejects.toThrow();
  });

  it("should default role to 'customer' if not provided", async () => {
    const user = await UserMock.create({
      name: "Default User",
      email: "default@example.com",
      password: "defaultpassword",
    });

    expect(user.role).toBe("customer");
  });
});
