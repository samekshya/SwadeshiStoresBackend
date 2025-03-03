// const { Sequelize } = require("sequelize");
// require("dotenv").config(); // Load environment variables

// // Initialize Sequelize with PostgreSQL connection
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: "postgres",
//   logging: false, // Set to true to see raw SQL queries
// });

// // Test Database Connection
// sequelize.authenticate()
//   .then(() => console.log("PostgreSQL connected successfully......."))
//   .catch(err => console.error("Database connection error:", err));


// // Import models


// // Sync models
// // sequelize.sync({ alter: true }) // alter: true ensures models match DB without data loss
// //   .then(() => console.log("All models synchronized"))
// //   .catch(err => console.error("Model sync error:", err));

// module.exports = sequelize;4
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "test" ? false : console.log, // Disable logs in test mode
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

module.exports = sequelize;
