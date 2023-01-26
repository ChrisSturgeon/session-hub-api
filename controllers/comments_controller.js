const Session = require('../models/session');
const Comment = require('../models/comment');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { reset } = require('nodemon');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Creates new comment in database for given Session ID.
exports.new = [
  body('date').exists().withMessage('Comment date required'),
  body('text')
    .isLength({ min: 1 })
    .withMessage('Comment length must be at least 1')
    .isLength({ max: 1500 })
    .withMessage('Comments must be <= 1500 characters when escaped')
    .trim()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        data: errors.mapped(),
        message: 'One or more invalid comment fields',
      });
    }

    try {
      const user = await User.findById(req.userID);
      if (!user) {
        res.status(404).json({
          status: 'fail',
          data: null,
          message: `User ${req.userID} not found`,
        });
        return;
      }

      const session = await Session.findById(req.params.sessionID);
      if (!session) {
        res.status(404).json({
          status: 'fail',
          data: null,
          message: `User ${req.params.sessionID} not found`,
        });
        return;
      }

      const comment = new Comment({
        sessionID: session._id,
        userID: user._id,
        username: user.username,
        text: req.body.text,
        createdDate: new Date(),
        editedDate: null,
        likes: [],
      });

      await comment.save();

      res.status(201).json({
        status: 'success',
        data: null,
        message: 'Comment successfully created',
      });
    } catch (err) {
      return next(err);
    }
  },
];

// Returns comments array for given Session ID
exports.all = async (req, res, next) => {
  try {
    const filter = { sessionID: ObjectId(req.params.sessionID) };
    const comments = await Comment.aggregate([
      { $match: filter },
      {
        $addFields: {
          hasLiked: {
            $cond: [{ $in: [req.userID, '$likes'] }, true, false],
          },
          likesCount: { $size: '$likes' },
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ]);

    if (!comments) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: `No comments found for session ${req.params.sessionID}`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: comments,
      message: `All comments for session ${req.params.sessionID}`,
    });
  } catch (err) {
    return next(err);
  }
};

// Likes or unlikes comment for give session and comment IDs
exports.like = [
  body('wantsToLike').exists(),
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentID);

      if (!comment) {
        res.status(404).json({
          status: 'fail',
          data: null,
          message: `Cannot find comment ${req.params.commentID}`,
        });
        return;
      }

      if (req.body.wantsToLike === 'true') {
        const existingLike = await Comment.findOne({
          _id: req.params.commentID,
          likes: { $in: req.userID },
        });

        if (existingLike) {
          res.status(409).json({
            status: 'fail',
            data: null,
            message: `User ${req.userID} already likes this comment`,
          });
          return;
        }

        await Comment.findByIdAndUpdate(req.params.commentID, {
          $push: { likes: req.userID },
        });

        res.status(201).json({
          status: 'success',
          data: null,
          message: 'Comment successfully liked',
        });
        return;
      } else {
        // User has unliked the comment
        await Comment.findByIdAndUpdate(req.params.commentID, {
          $pull: { likes: req.userID },
        });

        res.status(200).json({
          status: 'success',
          data: null,
          message: 'Comment successfully un-liked',
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.testAggregation = async (req, res, next) => {
  try {
    const filter = { sessionID: ObjectId(req.params.sessionID) };
    const comments = await Comment.aggregate([
      { $match: filter },
      {
        $addFields: {
          hasLiked: {
            $cond: [{ $in: [req.userID, '$likes'] }, true, false],
          },
          likesCount: { $size: '$likes' },
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ]);

    res.json({
      data: comments,
    });
  } catch (err) {
    return next(err);
  }
};
