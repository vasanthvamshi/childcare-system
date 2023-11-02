const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Sequelize } = require('sequelize');
const User = require('./models/user');

const app = express();

// Create and configure Sequelize - update with your database configuration
const sequelize = new Sequelize('childcare_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

// Define User model
const UserModel = require('./models/user')(sequelize, Sequelize);


// Configure Passport
// Configure Passport with a custom LocalStrategy
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) { // Implement a validPassword method in your User model
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
    .catch((err) => done(err));
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Specify the path to your views directory

// Routes

// Registration route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      return res.render('register'); // Render registration page with an error message
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/dashboard'); // Redirect to a dashboard page after successful registration
    });
  });
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login', // Redirect to login page on failure
}));

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
