// Import necessary modules
const bcrypt = require("bcryptjs");
const { User } = require("./models.js");

// Controller logic for the playground route
const playground = (req, res) => {
    // Render the playground view with the active page set to "playground"
    res.render("playground.html", {"active_page": "playground"});
};

// Controller logic for the leaderboard route
const leaderboard = async (req, res) => {
    try {
        // Fetch users sorted by score in descending order
        const players = await User.findAll({
            order: [['score', 'DESC']],
            attributes: ['username', 'total_win', 'total_lost', 'score'],
        });

        // Render the leaderboard view with the active page set to "leaderboard" and the fetched players
        res.render('leaderboard.html', {"active_page": "leaderboard", players});
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller logic for updating leaderboard data
const update_leaderboard = async (req, res) => {
  const { outcome } = req.body;
  
  // Assuming you have the user ID in the session
  const userId = req.session.user;

  try {
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update score based on the outcome
    if (outcome === 'win') {
      user.total_win += 1;
      user.score += 100;
    } else if (outcome === 'loss') {
      user.total_lost += 1;
      user.score -= 100;
    }

    // Save the updated user
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller logic for rendering the login page
const login = (req, res) => {
    // Render the login view with the active page set to "login"
    res.render("login.html", {"active_page": "login"});
};

// Controller logic for handling login form submission
const login_handler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Check if the password matches
    if (!passwordMatch) {
      req.flash('error', 'Incorrect username or password');
      return res.redirect('/login');
    }

    // Set the user's ID in the session for authentication
    req.session.user = user.id;

    res.redirect('/');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller logic for rendering the register page
const register = (req, res) => {
    // Render the register view with the active page set to "register"
    res.render("register.html", {"active_page": "register"});
};
  
// Controller logic for handling register form submission
const register_handler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.flash('error', 'Username already taken');
      return res.redirect('/register');
    }

    // Check if the password meets the minimum length requirement
    if (password.length < 6) {
      req.flash('error', 'Password should be at least 6 characters long');
      return res.redirect('/register');
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({ username, password: hashedPassword });

    // Set the user's ID in the session for authentication
    req.session.user = newUser.id;

    res.redirect('/');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller logic for handling user logout
const logout = (req, res) => {
    // Clear the session and cookies, then redirect to the login page
    req.session = null;
    res.clearCookie("session");
    res.clearCookie("session.sig");
    res.redirect('/login');
};

// Export the controller functions
module.exports = {
  playground,
  leaderboard,
  update_leaderboard,
  login,
  login_handler,
  register,
  register_handler,
  logout
};