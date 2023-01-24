const { body, validationResult } = require('express-validator');
const Session = require('../models/session');
const User = require('../models/user');

// Creates new Session in database
exports.new = [
  body('date').exists().withMessage('Session date required'),
  body('sport').exists().withMessage('Sport required').trim().escape(),
  body('location.name')
    .exists()
    .withMessage('Location name required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Location name must be at least 3 characters')
    .trim()
    .escape(),
  body('location.coords')
    .exists()
    .withMessage('Location coordinates required')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be array of length 2'),
  body('equipment.board')
    .isLength({ max: 40 })
    .withMessage('Board description must be 40 characters max')
    .trim()
    .escape(),
  body('equipment.sail')
    .isLength({ max: 40 })
    .withMessage('Sail description must be at least 3 characters')
    .trim()
    .escape(),
  body('equipment.kite')
    .isLength({ max: 40 })
    .withMessage('Kite description must be at least 3 characters')
    .trim()
    .escape(),
  body('equipment.wing')
    .isLength({ max: 40 })
    .withMessage('Wing description must be at least 3 characters')
    .trim()
    .escape(),
  body('description')
    .isLength({ max: 2000 })
    .withMessage('Session description must be less than 2000 characters')
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        data: errors.mapped(),
        message: 'One or more invalid session fields',
      });
    } else {
      try {
        const user = await User.findById(req.userID);
        if (user) {
          let equipment = {};
          if (req.body.sport === 'surfing') {
            equipment = {
              board: req.body.equipment.board,
            };
          }

          if (req.body.sport === 'windsurfing') {
            equipment = {
              board: req.body.equipment.board,
              sail: req.body.equipment.sail,
            };
          }

          if (req.body.sport === 'kitesurfing') {
            equipment = {
              board: req.body.equipment.board,
              kite: req.body.equipment.kite,
            };
          }

          if (req.body.sport === 'wingsurfing') {
            equipment = {
              board: req.body.equipment.board,
              wing: req.body.equipment.wing,
            };
          }

          if (req.body.sport === 'paddleboarding') {
            equipment = {
              board: req.body.equipment.board,
            };
          }
          const session = new Session({
            userID: user._id,
            username: user.username,
            description: req.body.description ? req.body.description : null,
            createdDate: new Date(),
            activityDate: req.body.date,
            sport: req.body.sport,
            locationName: req.body.location.name,
            coords: req.body.location.coords,
            equipment: req.body.equipment ? equipment : null,
            likes: [],
          });

          await session.save();
          res.status(200).json({
            status: 'success',
            data: null,
            message: 'Session created',
          });
        } else {
          res.status(404).json({
            status: 'fail',
            data: null,
            message: 'No such user found in database',
          });
        }
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Returns array of session overviews for given userID
exports.overviews = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userID);

    if (!user) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'No user found',
      });
    }
    const sessions = await Session.find({ userID: req.params.userID });
    if (sessions) {
      res.status(200).json({
        status: 'success',
        data: sessions,
        message: `Sessions overview for user ${req.params.userID}`,
      });
    } else {
      req.status(404).json({
        status: 'fail',
        data: null,
        message: `No sessions found for user ${req.params.userID}`,
      });
    }
  } catch (err) {
    return next(err);
  }
};
