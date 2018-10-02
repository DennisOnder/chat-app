const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const db = require('mongoose');
const key = require('./config/keys').mongoURI;
const bodyParser = require('body-parser');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
db.connect(key, {useNewUrlParser: true})
  .then(() => console.log('Database Connected!'))
  .catch(err => console.log(err));

// Test Route
app.get('/test', (req, res) => {
  res.json({
    username: 'Random Username',
    message: 'Random Message'
  });
});

app.listen(port, () => console.log(`Server running on port: ${port}.`));