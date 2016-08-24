var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');
var usersRouter = require('./routes/users');
var storiesRouter = require('./routes/stories');
var reportsRouter = require('./routes/reports');
var mediaRouter = require('./routes/media');
var newsRouter = require('./routes/news');
var profileRouter = require('./routes/profile');
var userReportsRouter = require('./routes/userreports');
var userStoriesRouter = require('./routes/userstories');

var app = express();

mongoose.Promise = require('bluebird');

//connect to database
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect('mongodb://localhost/express-movies');
}
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
  }
);
mongoose.connection.once('open', function() {
  console.log("Mongoose has connected to MongoDB!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'WDI Rocks!',
                  resave: true,
                  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport/passport')(passport);

app.use(function (req, res, next) {
  global.currentUser = req.user;
  next();
});

app.use('/', routes);
app.use('/users', usersRouter);
app.use('/stories', storiesRouter)
app.use('/reports', reportsRouter);
app.use('/media', mediaRouter);
app.use('/news', newsRouter);
app.use('/profile', profileRouter);
app.use('/userreports', userReportsRouter);
app.use('/userstories', userStoriesRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
