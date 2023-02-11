const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { body, validationResult } = require('express-validator');

// Model imports
const Comment = require('../models/comment');

// Creates new comment in database linked to given SessionID
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
      const comment = new Comment({
        sessionID: ObjectId(req.params.sessionID),
        userID: req.user._id,
        username: req.user.username,
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

// Returns all related comments in array for a given Session ID
exports.all = async (req, res, next) => {
  try {
    const filter = { sessionID: ObjectId(req.params.sessionID) };
    const comments = await Comment.aggregate([
      { $match: filter },
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
        $addFields: {
          hasLiked: {
            $cond: [{ $in: [req.user._id, '$likes'] }, true, false],
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
        message: `no comments found for session ${req.params.sessionID}`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: comments,
      message: `all comments for session ${req.params.sessionID}`,
    });
  } catch (err) {
    return next(err);
  }
};

// Deletes comment from database
exports.delete = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentID);
    res.status(200).json({
      status: 'success',
      data: null,
      message: 'comment successfully deleted',
    });
  } catch (err) {
    return next(err);
  }
};

// Likes comment
exports.like = async (req, res, next) => {
  try {
    const existingLike = await Comment.findOne({
      _id: req.params.commentID,
      likes: { $in: req.user._id },
    });

    if (existingLike) {
      res.status(409).json({
        status: 'fail',
        data: null,
        message: `User ${req.user._id} already likes this comment`,
      });
      return;
    }

    await Comment.findByIdAndUpdate(req.params.commentID, {
      $push: { likes: req.user._id },
    });

    res.status(201).json({
      status: 'success',
      data: null,
      message: 'Comment successfully liked',
    });
  } catch (err) {
    return next(err);
  }
};

// Unlikes comment
exports.unlike = async (req, res, next) => {
  try {
    await Comment.findByIdAndUpdate(req.params.commentID, {
      $pull: { likes: req.user._id },
    });

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Comment successfully un-liked',
    });
  } catch (err) {
    return next(err);
  }
};
