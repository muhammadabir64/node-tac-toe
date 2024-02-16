// Import the required module for creating routes
const router = require('express').Router();

// Import controller functions from the 'controllers' module
const {
  playground,
  leaderboard,
  update_leaderboard,
  login,
  login_handler,
  register,
  register_handler,
  logout,
} = require('./controllers');

// Middleware to check if the user is logged in
const login_required = (req, res, next) => {
    // Redirect to the login page if the user is not logged in
    if (!req.session.user) {
        return res.redirect("/login");
    }
    // Continue to the next middleware or route handler
    next();
}

// Define routes and associate them with controller functions
router.get("/", login_required, playground);
router.get("/leaderboard", login_required, leaderboard);
router.post('/update_leaderboard', update_leaderboard);

// Routes for login view and authentication
router.get("/login", login);
router.post("/login", login_handler);

// Routes for register view and account creation
router.get("/register", register);
router.post("/register", register_handler);

// Route to log the user out
router.get("/logout", logout);

// Export the router for use in other parts of the application
module.exports = router;