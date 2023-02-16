const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { body, validationResult } = require('express-validator');

// Model imports
const Session = require('../models/session');
const User = require('../models/user');

// Creates new Session
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
    .isLength({ max: 2500 })
    .withMessage(
      'Session description must be less than 2500 characters when escaped'
    )
    .trim()
    .escape(),
  body('conditions.wind.direction').isFloat({ min: 0, max: 360 }),
  body('conditions.wind.speed').isFloat({ min: 0, max: 200 }),
  body('conditions.wind.gust').isFloat({ min: 0, max: 200 }),
  body('conditions.swell.direction').isFloat({ min: 0, max: 360 }),
  body('conditions.swell.height').isFloat({ min: 0, max: 50 }),
  body('conditions.swell.frequency').isFloat({ min: 0, max: 50 }),

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
          userID: req.user._id,
          username: req.user.username,
          description: req.body.description ? req.body.description : null,
          createdDate: new Date(),
          activityDate: req.body.date,
          sport: req.body.sport,
          locationName: req.body.location.name,
          coords: req.body.location.coords,
          equipment: req.body.equipment ? equipment : null,
          conditions: req.body.conditions,
          likes: [],
        });

        const newSession = await session.save();

        res.status(200).json({
          status: 'success',
          data: newSession._id,
          message: 'Session created',
        });
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Updates Session
exports.update = [
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
    .isLength({ max: 2500 })
    .withMessage(
      'Session description must be less than 2500 characters when escaped'
    )
    .trim()
    .escape(),
  body('conditions.wind.direction').isFloat({ min: 0, max: 360 }),
  body('conditions.wind.speed').isFloat({ min: 0, max: 200 }),
  body('conditions.wind.gust').isFloat({ min: 0, max: 200 }),
  body('conditions.swell.direction').isFloat({ min: 0, max: 360 }),
  body('conditions.swell.height').isFloat({ min: 0, max: 50 }),
  body('conditions.swell.frequency').isFloat({ min: 0, max: 50 }),

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
        await Session.findByIdAndUpdate(req.params.sessionID, {
          description: req.body.description ? req.body.description : null,
          activityDate: req.body.date,
          sport: req.body.sport,
          locationName: req.body.location.name,
          coords: req.body.location.coords,
          equipment: req.body.equipment ? equipment : null,
          conditions: req.body.conditions,
        });

        res.status(200).json({
          status: 'success',
          data: null,
          message: 'Session Updated',
        });
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Deletes session
exports.delete = async (req, res, next) => {
  try {
    await Session.findByIdAndDelete(req.params.sessionID);

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Session succesfully deleted',
    });
  } catch (err) {
    return next(err);
  }
};

// Returns details for a given session
exports.detail = async (req, res, next) => {
  try {
    const filter = { _id: ObjectId(req.params.sessionID) };
    const session = await Session.aggregate([
      { $match: filter },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'userDetails',
          pipeline: [
            {
              $project: {
                thumbURL: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'sessionID',
          as: 'commentsCount',
        },
      },
      {
        $addFields: {
          hasLiked: {
            $cond: [{ $in: [req.user._id, '$likes'] }, true, false],
          },
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$commentsCount' },
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: session[0],
      message: `Session data for ${req.params.sessionID}`,
    });
  } catch (err) {
    return next(err);
  }
};

// Likes session
exports.like = async (req, res, next) => {
  try {
    const existingLike = await Session.findOne({
      _id: req.params.sessionID,
      likes: { $in: req.user._id },
    });

    if (existingLike) {
      res.status(409).json({
        status: 'fail',
        data: null,
        message: `User ${req.user._id} already likes this session`,
      });
      return;
    }

    await Session.findByIdAndUpdate(req.params.sessionID, {
      $push: { likes: req.user._id },
    });

    res.status(201).json({
      status: 'success',
      data: null,
      message: 'Session successfully liked',
    });
    return;
  } catch (err) {
    return next(err);
  }
};

// Unlikes session
exports.unlike = async (req, res, next) => {
  try {
    await Session.findByIdAndUpdate(req.params.sessionID, {
      $pull: { likes: req.user._id },
    });

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Session successfully un-liked',
    });
  } catch (err) {
    return next(err);
  }
};

// Most recent session of each of the friends of specific userID
exports.feed = async (req, res, next) => {
  try {
    const filter = {
      'friends.ID': ObjectId(req.user._id),
    };

    const feedSessions = await User.aggregate([
      { $match: filter },
      { $project: { _id: 1, thumbURL: 1 } },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'userID',
          // let: { testID: '_id' },
          // pipeline: [
          //   { $sort: { activityDate: -1 } },
          //   { $limit: 1 },
          //   {
          //     $lookup: {
          //       from: 'comments',
          //       localField: 'testID',
          //       foreignField: 'sessionID',
          //       as: 'commentsCount',
          //     },
          //   },
          //   {
          //     $addFields: {
          //       hasLiked: {
          //         $cond: [
          //           { $in: [ObjectId(req.params.userID), '$likes'] },
          //           true,
          //           false,
          //         ],
          //       },
          //       likesCount: { $size: '$likes' },
          //       commentsCount: { $size: '$commentsCount' },
          //     },
          //   },
          //   {
          //     $project: {
          //       createdDate: 0,
          //       equipment: 0,
          //       description: 0,
          //       conditions: 0,
          //     },
          //   },
          // ],
          as: 'session',
        },
      },
      { $sort: { 'post.activityDate': -1 } },
    ]);

    if (!feedSessions) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'No latest sessions found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: feedSessions,
      message: `Latest sessions of friends for user ${req.params.userID}`,
    });
  } catch (err) {
    return next(err);
  }
};

// Session overviews for specific user
exports.overviews = async (req, res, next) => {
  try {
    const filter = { userID: ObjectId(req.params.userID) };
    const sessions = await Session.aggregate([
      { $match: filter },
      { $sort: { activityDate: -1 } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'sessionID',
          as: 'commentsCount',
        },
      },
      {
        $addFields: {
          hasLiked: {
            $cond: [{ $in: [req.user._id, '$likes'] }, true, false],
          },
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$commentsCount' },
        },
      },
      {
        $project: {
          likes: 0,
          description: 0,
          createdDate: 0,
          equipment: 0,
        },
      },
    ]);
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
