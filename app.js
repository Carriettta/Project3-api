var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var mongoose = require('mongoose');
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);

var app = express();
app.use(cors({
  origin: ["http://localhost:3001", "https://localhost:3001"],
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
  secret: "basic-auth-secret",
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

//routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/tasks'));
app.use('/', require('./routes/logout'));

//db connection
mongoose
  .connect('mongodb+srv://admin:gM7DzaNemGafwz3f@project3-n9wz1.mongodb.net/Project3?retryWrites=true&w=majority', {
    useNewUrlParser: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = app;