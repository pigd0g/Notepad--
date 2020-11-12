const dotenv = require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const bodyParser   = require('body-parser');
const moment = require('moment')

const app = express();

var mongodb = require('./config/mongo.js');

app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// EJS
app.set('view engine', 'ejs');

app.use("/public",express.static(__dirname + "/public"));

app.locals.moment = moment

app.use(function(req, res, next) {
  res.locals.title = 'Notepad--'
  next();
});


app.use(function(err, req, res, next) {
  console.log("Error", err)
  // Wait a couple of seconds for DB to connect
  setTimeout(function() {
    res.redirect('/')
  }, 2000)

});

// Routes
app.use('/', require('./routes/pages.js'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

