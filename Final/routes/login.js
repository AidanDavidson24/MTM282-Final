const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Import your User model

// Register Page
router.get('/signup', (req, res) => {
  res.render('signup'); // Render the signup form
});

// Handle Registration
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, age, question1, question2, question3 } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      age,
      questions: {
        question1,
        question2,
        question3,
      },
    });

    await newUser.save(); // Save the user to the database
    res.redirect('/login'); // Redirect to login page after successful registration
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login'); // Render the login form
});

// Handle Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send('Invalid Username or Password');
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send('Invalid Username or Password');
    }

    // Set a session to keep the user logged in
    req.session.userId = user._id;

    res.redirect('/home'); // Redirect to the home page after successful login
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
