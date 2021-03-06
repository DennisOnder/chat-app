const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const db = require('mongoose');
const key = require('./config/keys').mongoURI;
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const messages = require('./routes/api/messages');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
db.connect(key, {useNewUrlParser: true})
  .then(() => console.log('Database Connected!'))
  .catch(err => console.log(err));

// Passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Test Route
app.get('/test', (req, res) => {
  res.json({
    Test: 'Success'
  });
});

// Routes
app.use('/api/users', users);
app.use('/api/messages', messages);

app.listen(port, () => console.log(`Server running on port: ${port}.`));