// Import necessary modules
const { Sequelize } = require("sequelize");
const path = require("path");

// Define the path to the SQLite database file
const dbPath = path.join(__dirname, "database.db");

// Create a new Sequelize instance with SQLite as the dialect and the specified storage path
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false, // Disable logging of SQL queries for a cleaner console output
});

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;