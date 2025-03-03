const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/database"); 

const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "uploads"
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Start the server **only if not running in test mode**
let server;
if (process.env.NODE_ENV !== "test") {
    sequelize
        .sync({ alter: true })
        .then(() => console.log("Database synchronized successfully......"))
        .catch((err) => {
            console.error("Database sync error:", err);
            process.exit(1);
        });

    const PORT = process.env.PORT || 8000;
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}...`);
    });
} else {
    console.log("Running in test mode. Server is not started automatically.");
}


// Export for tests
module.exports = { app, server };
