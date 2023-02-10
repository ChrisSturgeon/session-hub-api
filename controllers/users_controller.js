const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Models imports
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');

// Creates new user in database
exports.registerPOST = [
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
    .isLength({ max: 50 })
    .withMessage('Password must be a maximum of 50 characters'),

  // Process request
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.mapped());
    }

    try {
      const userNameExists = await User.findOne({
        username: req.body.username,
      });
      if (userNameExists) {
        res.status(409).json({
          status: 'error',
          data: null,
          message: 'Username already exists',
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        profileComplete: false,
        joined: new Date(),
        friends: [],
        friendRequests: [],
        sports: [],
        imgURL: 'https://i.imgur.com/RpjwdOf.png',
        thumbURL: 'https://i.imgur.com/RpjwdOf.png',
        bio: '',
      });

      await user.save();

      res.status(200).json({
        status: 'success',
        data: null,
        message: 'User successfully created',
      });
    } catch (err) {
      return next(err);
    }
  },
];

// Logs in user and issues JWT valid for 7 days
exports.loginPOST = [
  body('username').trim().escape(),
  body('password').trim().escape(),

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
        bcrypt.compare(password, foundUser.password, async (err, data) => {
          if (err) {
            return next(err);
          }
          if (data) {
            const options = {
              expiresIn: '7d',
            };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ sub: foundUser._id }, secret, options);

            const usersFriendsRequests = await FriendRequest.find({
              'requester.ID': req.userID,
              status: 'pending',
            });

            if (usersFriendsRequests) {
              return res.status(200).json({
                status: 'success',
                data: {
                  token,
                  username: foundUser.username,
                  ID: foundUser._id,
                  profileComplete: foundUser.profileComplete,
                  friends: foundUser.friends,
                  pendingRequests: usersFriendsRequests,
                },
                message: 'Log In Successful',
              });
            } else {
              return res.status(200).json({
                status: 'success',
                data: {
                  token,
                  username: foundUser.username,
                  ID: foundUser._id,
                  profileComplete: foundUser.profileComplete,
                  friends: foundUser.friends,
                  pendingRequests: [],
                },
                message: 'Log In Successful',
              });
            }
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

// Returns users details for front-end authentication
exports.authenticateGET = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.user._id,
      'username profileComplete friends'
    );
    if (user) {
      const usersFriendsRequests = await FriendRequest.find({
        'requester.ID': req.user._id,
        status: 'pending',
      });

      if (usersFriendsRequests) {
        res.status(200).json({
          status: 'success',
          data: {
            username: user.username,
            ID: user._id,
            profileComplete: user.profileComplete,
            friends: user.friends,
            pendingRequests: usersFriendsRequests,
          },
          message: 'Authentication successful',
        });
      } else {
        res.status(200).json({
          status: 'success',
          data: {
            username: user.username,
            ID: user._id,
            profileComplete: user.profileComplete,
            friends: user.friends,
            pendingRequests: [],
          },
          message: 'Authentication successful',
        });
      }
    } else {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'No user found in database',
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Updates users public profile details
exports.profileUpdate = [
  body('sports').isArray(),
  body('sports.*').escape().trim(),
  body('bio').isLength({ max: 2000 }).trim().escape(),
  body('imgURL').isLength({ max: 1000 }).trim(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'fail',
          data: errors.mapped(),
          message: 'One or more invalid session fields',
        });
      }
      await User.findByIdAndUpdate(req.params.userID, {
        bio: req.body.bio,
        sports: req.body.sports,
        imgURL: req.body.imgURL,
      });

      res.status(200).json({
        status: 'success',
        data: null,
        message: 'Profile successfully updated',
      });
    } catch (err) {
      return next(err);
    }
  },
];

// Delete user on POST method
exports.deletePOST = (req, res, next) => {
  // Delete user code here
};

// Returns list of all users on platform
exports.all = async (req, res, next) => {
  try {
    const users = await User.find({}, 'username thumbURL')
      .collation({ locale: 'en' })
      .sort('username');

    if (users) {
      res.status(200).json({
        status: 'success',
        data: users,
        message: 'All registered users',
      });
    } else {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'No data for all users found',
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Returns public profile details for user
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.params.userID,
      'username bio joined sports imgURL thumbURL'
    );

    if (user) {
      res.status(200).json({
        status: 'success',
        data: {
          username: user.username,
          bio: user.bio,
          joined: user.joined,
          sports: user.sports,
          imgURL: user.imgURL,
          thumbURL: user.thumbURL,
        },
        message: `Profile details for user ${req.params.userID}`,
      });
    } else {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: `No user with id ${req.params.userID} found`,
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Returns 6 most recently joined users
exports.latestUsers = async (req, res, next) => {
  try {
    const latestUsers = await User.find(null, 'username thumbURL')
      .sort({ joined: -1 })
      .limit(6);

    res.status(200).json({
      status: 'success',
      data: latestUsers,
      message: 'The five most recently joined users',
    });
  } catch (err) {
    return next(err);
  }
};
