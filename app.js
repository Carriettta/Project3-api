var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var mongoose = require('mongoose');
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')
require("dotenv").config();
var app = express();
app.use(cors({
  origin: [`${process.env.client_origin_a}`, `${process.env.client_origin_b}`],
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({
  secret: `${process.env.SESSION_SECRET}`,
  cookie: {
    maxAge: 6000000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

//protect
function protect(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(403).json({
      message: "not logged in"
    });
  }
}

app.use(bodyParser.urlencoded({ 
  extended: true 
}));

//routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/tasks'));
app.use('/', require('./routes/logout'));

//db connection
mongoose
  .connect(`${process.env.mongodb_connection_string}`, {
    useNewUrlParser: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = app;