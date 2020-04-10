var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var mongoose = require('mongoose');
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');
var signupRouter = require('./routes/signup')

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', signupRouter);
// app.use('/auth/signup', require("./routes/signup"));
app.use('/tasks', tasksRouter);

//login:
app.use('/', require("./routes/login"));

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

// login
// app.use(function(req,res,next){
//   res.locals.isloggedin = false;
//   if(req.session.isloggedin){
//       res.locals.user = req.session.user;
//       res.locals.isloggedin = true;
//   }
//   next();
// })

//other session stuff
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});


//db connection
mongoose
  .connect('mongodb://localhost/Project3', {useNewUrlParser: true})
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = app;
