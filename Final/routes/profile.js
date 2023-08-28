const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/home', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/login'); // User not found, redirect to login
    }

    res.render('home', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Profile Editing Page (requires authentication)
router.get('/edit', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/login'); // User not found, redirect to login
    }

    res.render('edit', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle Profile Editing (requires authentication)
router.post('/edit', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const { age, question1, question2, question3 } = req.body;

    // Update user data
    await User.findByIdAndUpdate(req.session.userId, {
      age,
      questions: {
        question1,
        question2,
        question3,
      },
    });

    res.redirect('/home'); // Redirect to home page after successful edit
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout (destroy the session)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/login'); // Redirect to login page after logout
    }
  });
});

module.exports = router;