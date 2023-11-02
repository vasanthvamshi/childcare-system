const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      return res.render('register'); // Redirect to the registration page if there's an error
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/dashboard'); // Redirect to the user's dashboard upon successful registration
    });
  });
});

// Login route
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  }),
);

module.exports = router;
