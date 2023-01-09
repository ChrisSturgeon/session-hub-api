// Package imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Security imports
require('dotenv').config();
const JwtStrategy = require('./jwt');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

// Router imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// MongoDB
const mongoStart = require('./mongoConfig');
const User = require('./models/user');
mongoStart();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(JwtStrategy);

// Facebook login strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/api/users/oauth2/redirect/facebook',
    },
    function (accessToken, refreshToken, profile, cb) {
      User.find({ facebookID: profile.id }, async function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          try {
            const user = new User({
              username: profile.displayName,
              profileComplete: false,
              joined: new Date(),
              friends: [],
              friendRequests: [],
              sports: [],
              facebookID: profile.id,
            });
            await user.save();
            return cb(err, user);
          } catch (err) {
            return cb(err);
          }
        } else {
          return cb(null, user);
        }
      });
    }
  )
);
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

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
