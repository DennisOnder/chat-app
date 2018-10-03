const express = require('express');
const router = express.Router();
const Validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Message = require('../../models/Message');

// @route  GET api/messages
// @desc   Get all messages
// @access Public
router.get('/', passport.authenticate('jwt', { session: false }),(req, res) => {
  Message.find()
    .sort({ date: -1 })
    .limit(15)
    .then(messages => res.json(messages))
    .catch(err => res.status(404).json({ noMessagesFound: 'No Messages Found.' }))
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(Validator.isEmpty(req.body.message)) {
    return res.status(401).json({ message: 'Message Field Is Required.' });
  } else {
    const newMessage = new Message({
      message: req.body.message,
      user: req.user.id
    });
    newMessage.save().then(message => res.json(message));
  }
});

module.exports = router;