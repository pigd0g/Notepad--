const dotenv = require('dotenv').config()

const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser   = require('body-parser');
const moment = require('moment')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

require('./config/passport')(passport);

var mongodb = require('./config/mongo.js');

app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongodb.mongo_session, ttl: 30 * 24 * 60 * 60 })
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

