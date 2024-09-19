const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

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

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Tier-List Builder', user: req.user });
});

app.get('/tierlist', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('tierList', { user: req.user });
  } else if (req.query.guest === 'true'){
    res.render('tierList', { user: null });
  } else {
    res.redirect('/');
  }
});

//Image search routes
const axios = require('axios');

app.get('/search-images', async (req, res) => {
  const query = req.query.query;
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: query,
        per_page: 9,
      },
      headers: {
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    res.status(500).json({ error: 'An error occurred while searching for images' });
  }
});

//Share routes
const shareRoutes = require('./routes/share');
app.use('/share', shareRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});
