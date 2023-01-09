const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.test = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'It worked!',
  });
};

// Register new user on POST
exports.registerPOST = [
  // Sanitise and validates body
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .isLength({ max: 20 })
    .withMessage('Username must be a maximum of 20 characters')
    .escape(),

  body('password')
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be a minimum of 8 characters, containing at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
    )
    .isLength({ max: 200 })
    .withMessage('Password must a maximum of 50 characters'),

  // Process request
  async (req, res, next) => {
    // Check for validation errors and return in array if present
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.mapped());
    } else {
      // Check request username doesn't already exist in the database
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res
          .status(409)
          .send(
            `A user with username ${req.body.username} already exists. Please choose a different username.`
          );
      }
      // Hash password, create User object, and store it in the database
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          profileComplete: false,
          joined: new Date(),
          friends: [],
          friendRequests: [],
          sports: [],
        });
        await user.save();
        res.status(200).send('User successfully created in database');
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Login user and issue JWT on POST
exports.loginPOST = [
  // Sanitise and validate input
  body('username').trim().escape(),
  body('password').trim().escape(),

  // Process request
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const foundUser = await User.findOne({ username: username });
      if (!foundUser) {
        return res.status(404).json({
          status: 'error',
          data: null,
          message: 'User does not exist',
        });
      } else {
        bcrypt.compare(password, foundUser.password, (err, data) => {
          if (err) {
            return next(err);
          }
          if (data) {
            const options = {
              expiresIn: '1d',
            };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ sub: foundUser._id }, secret, options);
            return res.status(200).json({
              status: 'success',
              data: {
                token,
              },
              message: 'Authentication Successful',
            });
          } else {
            res.status(403).json({
              status: 'error',
              data: null,
              message: 'Incorrect password',
            });
          }
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.authenticateGET = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Authenticated successful',
  });
};

// Update user details on PUT?
exports.updatePUT = (req, res, next) => {
  // Update user code here
};

// Delete user on POST method
exports.deletePOST = (req, res, next) => {
  // Delete user code here
};