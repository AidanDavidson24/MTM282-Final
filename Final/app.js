const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const {MongoClient} = require("mongodb");
const bcrypt = require('bcryptjs'); 
const app = express();
const path = require('path');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('title');
});

app.get('/features', (req, res) => {
  res.render('features');
});

app.get('/order', (req, res) => {
  res.render('order');
});

app.get('/login', (req, res) => {
  res.render('login'); // Render the login.pug template
});

app.get('/home', (req, res) => {
  res.render('home'); // Render the login.pug template
});

app.get('/edit', (req, res) => {
  res.render('edit'); // Render the login.pug template
});

app.get('/signup', (req, res) => {
  res.render('signup'); // Render the login.pug template
});

app.listen(2444, () => {
  console.log('Server is running on port 2444');
});
app.use((req, res, next) => {
  const now = new Date();
  const lastVisit = req.cookies.lastVisit;
  res.cookie('lastVisit', now.toUTCString());
  next();
});

app.get('/api', async (req, res) => {
  try {
    const users = await User.find({});
    const stats = {
      totalUsers: users.length,
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});