const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Set up view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Tier-List Builder' });
});

app.get('/tierlist', (req, res) => {
  res.render('tierList');
});

// Login routes (placeholders for now)
app.post('/login/github', (req, res) => {
  res.redirect('/tierlist');
});

app.post('/login/google', (req, res) => {
  res.redirect('/tierlist');
});

app.post('/login/guest', (req, res) => {
  res.redirect('/tierlist');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
