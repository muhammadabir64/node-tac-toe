// Import necessary modules
const { DataTypes } = require("sequelize");
const sequelize = require("./database.js");

// Define the 'User' model using Sequelize
const User = sequelize.define("User", {
  // Define the 'username' attribute with string type, disallow null values
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Define the 'password' attribute with text type, disallow null values
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Define the 'total_win' attribute with integer type, allow null values, default value is 0
  total_win: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  // Define the 'total_lost' attribute with integer type, allow null values, default value is 0
  total_lost: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  // Define the 'score' attribute with integer type, allow null values, default value is 0
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, { 
  // Disable automatic timestamps for createdAt and updatedAt
  timestamps: false,
});

// Export the 'User' model for use in other parts of the application
module.exports = {
  User
};