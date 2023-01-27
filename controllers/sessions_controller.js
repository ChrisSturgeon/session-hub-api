const { body, validationResult } = require('express-validator');
const Session = require('../models/session');
const User = require('../models/user');
const mongoose = require('mongoose');
const { ResultWithContext } = require('express-validator/src/chain');
const ObjectId = mongoose.Types.ObjectId;

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
    .isLength({ max: 2500 })
    .withMessage(
      'Session description must be less than 2500 characters when escaped'
    )
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
    const filter = { userID: ObjectId(req.params.userID) };
    const sessions = await Session.aggregate([
      { $match: filter },
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
            $cond: [{ $in: [req.userID, '$likes'] }, true, false],
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

// Returns details for a given session
exports.detail = async (req, res, next) => {
  try {
    const filter = { _id: ObjectId(req.params.sessionID) };
    const session = await Session.aggregate([
      { $match: filter },
      { $limit: 1 },
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
            $cond: [{ $in: [req.userID, '$likes'] }, true, false],
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

    if (!session) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: `No session with ID ${req.params.sessionID} found`,
      });
    }
    res.status(200).json({
      status: 'success',
      data: session[0],
      message: `Session data for ${req.params.sessionID}`,
    });
  } catch (err) {
    return next(err);
  }
};

exports.like = [
  body('wantsToLike').exists().withMessage('Required as stringified boolean'),

  async (req, res, next) => {
    console.log(req.body.wantsToLike);
    try {
      const session = await Session.findById(req.params.sessionID);

      if (!session) {
        res.status(404).json({
          status: 'fail',
          data: null,
          message: `Session ${req.params.sessoinID} not found`,
        });
        return;
      }

      if (req.body.wantsToLike === 'true') {
        const existingLike = await Session.findOne({
          _id: req.params.sessionID,
          likes: { $in: req.userID },
        });

        if (existingLike) {
          res.status(409).json({
            status: 'fail',
            data: null,
            message: `User ${req.userID} already likes this session`,
          });
          return;
        }

        await Session.findByIdAndUpdate(req.params.sessionID, {
          $push: { likes: req.userID },
        });

        res.status(201).json({
          status: 'success',
          data: null,
          message: 'Session successfully liked',
        });
        return;
      } else {
        // User has unliked the Session
        await Session.findByIdAndUpdate(req.params.sessionID, {
          $pull: { likes: req.userID },
        });

        res.status(200).json({
          status: 'success',
          data: null,
          message: 'Session successfully un-liked',
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.feed = async (req, res, next) => {
  if (req.userID.toString() !== req.params.userID.toString()) {
    res.status(403).json({
      status: 'fail',
      data: null,
      message: 'You are not authorised to retrieve this resource',
    });
    return;
  }
  try {
    const filter = {
      'friends.ID': ObjectId(req.params.userID),
    };

    const feedSessions = await User.aggregate([
      { $match: filter },
      { $project: { _id: 1 } },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'userID',
          pipeline: [
            { $sort: { activityDate: -1 } },
            { $limit: 1 },
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
                  $cond: [
                    { $in: [ObjectId(req.params.userID), '$likes'] },
                    true,
                    false,
                  ],
                },
                likesCount: { $size: '$likes' },
                commentsCount: { $size: '$commentsCount' },
              },
            },
            {
              $project: {
                createdDate: 0,
                equipment: 0,
                description: 0,
              },
            },
          ],
          as: 'post',
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
