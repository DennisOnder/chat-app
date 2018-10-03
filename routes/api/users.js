const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Validator = require('validator');
const mongoose = require('mongoose');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secret = require('../../config/keys').secretOrKey;

// @route  POST api/users/register
// @desc   Register a new user
// @access Public
router.post('/register', (req, res) => {
  let errors = {};
  if(Validator.isEmpty(req.body.username)) {
    errors.username = 'Username Field Is Required.';
  }
  if(!Validator.isLength(req.body.username, {min: 6, max: 16})) {
    errors.username = 'Username Must Be Between 6 And 16 Characters Long.';
  }
  if(Validator.isEmpty(req.body.password)) {
    errors.password = 'Password Field Is Required.';
  }
  if(!Validator.isLength(req.body.password, {min: 6, max: 16})) {
    errors.password = 'Password Must Be Between 6 And 16 Characters Long.';
  }
  if(errors.username || errors.password) {
    return res.status(400).json(errors);
  } else {
    User.findOne({ username: req.body.username })
    .then(user => {
      if(user) {
        res.status(400).json({username: 'This username is taken.'})
      } else {
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
              throw err
            } else {
              newUser.password = hash
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err))
            }
          })
        })
      }
    })
  }
});


// @route  POST api/users/login
// @desc   Login
// @access Public
router.post('/login', (req, res) => {
  let errors = {};
  if(Validator.isEmpty(req.body.username)) {
    errors.username = 'Username Field Is Required.';
  }
  if(Validator.isEmpty(req.body.password)) {
    errors.password = 'Password Field Is Required.';
  }
  if(errors.username || errors.password) {
    return res.status(400).json(errors);
  } else {
    User.findOne({ username: req.body.username })
    .then(user => {
      if(!user) {
        return res.status(404).json({user: 'User not found.'})
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(isMatched => {
            if(isMatched) {
              const payload = {
                id: user.id,
                username: user.username,
                isLoggedIn: true
              };
              jwt.sign(payload, secret, { expiresIn: 3600000 }, (err, token) => {
                res.json({ success: true, token: 'Bearer ' + token });
              });
            } else {
              return res.status(400).json({ password: 'Invalid Password' }); 
            }
          })
        }
    })
  }
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username
  });
});

// @route  GET api/users/:id
// @desc   Find user by ID
// @access Private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json({
      id: user._id,
      username: user.username
    }))
    .catch(err => res.json(err));
});

module.exports = router;