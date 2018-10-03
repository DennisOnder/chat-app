const express = require('express');
const router = express.Router();
const Validator = require('validator');
const mongoose = require('mongoose');
const Message = require('../../models/Message');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// @route  GET api/messages
// @desc   Get all messages
// @access Public
router.get('/', (req, res) => {
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
    res.status(401).json({ message: 'Message Field Is Required.' });
  } else {
    const newMessage = new Message({
      userId: req.user.id,
      message: req.body.message
    });
    newMessage.save().then(message => res.json(message));
  }
});

module.exports = router;