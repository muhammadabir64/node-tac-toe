// Import required modules for the project
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const nunjucks = require("nunjucks");

// Import the database connector
const sequelize = require("./database.js");

// Import routers and models
const routers = require("./routers.js");
const { User } = require("./models.js");

// Set the port for the server to run on, defaulting to 8000
const PORT = process.env.PORT || 8000;

// Create an Express application
const app = express();

// Configure Nunjucks for rendering HTML templates
nunjucks.configure("views", {
    express: app,
    autoescape: true
});
app.set("view engine", "html");

// Middleware for handling form data
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Serve static files from the 'staticfiles' directory under the '/assets' route
app.use("/assets", express.static(__dirname + "/staticfiles"));

// Middleware for handling cookies
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["Im5464asdadsadads7fyasd"]
}));

// Middleware for handling sessions and flash messages
app.use(session({
  secret: "ArtFDCUt18PI3656d34y9K",
  resave: true,
  saveUninitialized: false
}));
app.use(flash());

// Custom middleware to make flash messages and user session data available globally
app.use(async (req, res, next) => {
  app.locals.flash = req.flash();
  app.locals.user = req.session.user;
  next();
});

// Use the defined routers for handling different routes
app.use("", routers);

// Synchronize the model with the database, altering the schema if needed
sequelize.sync({ alter: true }).then(() => {
    console.log("Database connection has been established");
}).catch((error) => {
    console.error("Unable to connect to the database:", error);
});

// Make the server listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});