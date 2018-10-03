const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Validator = require('validator');
const mongoose = require('mongoose');
const User = require('../../models/User');

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
                username: user.username,
                isLoggedIn: true
              };
              res.json(payload);
            } else {
              return res.status(400).json({ password: 'Invalid Password' }); 
            }
          })
        }
    })
  }
})

module.exports = router;