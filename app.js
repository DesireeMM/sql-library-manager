var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// connect to db
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Uh oh, this page does not exist."));
});

// error handler
app.use(function(err, req, res, next) {
  // handle 404 errors
  if (err.status === 404) {
    res.render('error', {error: err})
  } else {
    // render the error page
    err.status = err.status || 500;
    err.message = err.message || "Oops, something went wrong.";
    console.log(err.status, err.message);
    res.render('error', {error: err});
  }

});

module.exports = app;
