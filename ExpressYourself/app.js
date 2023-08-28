const express = require('express');
const app = express();
const path = require('path');

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});