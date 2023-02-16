// Package imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Security imports
require('dotenv').config();
const JwtStrategy = require('./jwt');
const passport = require('passport');
const helmet = require('helmet');

// Router imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const friendsRouter = require('./routes/friends');
const sessionsRouter = require('./routes/sessions');
const commentsRouter = require('./routes/comments');

// MongoDB
// const mongoStart = require('./mongoConfig');
// mongoStart();

const mongoDb = process.env.MONGODB_URI;
mongoose.set('strictQuery', true);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/test', (req, res, next) => {
  res.send('This is the post test route');
});

passport.use(JwtStrategy);

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/comments', commentsRouter);

// Uncomment to console log trace warning
// process.on('warning', (e) => console.warn(e.stack));

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
  res.json(err);
});

module.exports = app;
