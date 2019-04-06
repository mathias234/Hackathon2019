var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
var expressValidator = require('express-validator');
var MySQLStore = require('express-mysql-session')(expressSession);
var config = require('config');

const sqlSessionsOptions = config.get('dbConfig');

var sessionStore = new MySQLStore(sqlSessionsOptions);
var indexRouter = require('./routes/index');
var bestillRouter = require('./routes/bestill');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');
var omOssRouter = require('./routes/omoss');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  key: 'pizza_bakeren_50019202',
  secret: 'pizza_bakeren_55928582104129',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use('/', indexRouter);
app.use('/bestill', bestillRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/omoss', omOssRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
