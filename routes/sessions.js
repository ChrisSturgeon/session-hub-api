const express = require('express');
const router = express.Router();
const authenticateJWT = require('../protected.js');
const verify = require('../verify');

// Controller imports
const sessionsController = require('../controllers/sessions_controller');
const commentsController = require('../controllers/comments_controller');

// Create new session
router.post('/', authenticateJWT, sessionsController.new);

// Updates session
router.put(
  '/:sessionID',
  authenticateJWT,
  verify.sessionExists,
  verify.isSessionOwner,
  sessionsController.update
);

// Return all details for specific session
router.get(
  '/:sessionID',
  authenticateJWT,
  verify.sessionExists,
  sessionsController.detail
);

// Like session
router.put(
  '/:sessionID/like',
  authenticateJWT,
  verify.sessionExists,
  sessionsController.like
);

// Unlike session
router.delete(
  '/:sessionID/like',
  authenticateJWT,
  verify.sessionExists,
  sessionsController.unlike
);

// ***** Feeds *****

// Feed of latest posts by friends for given user
router.get(
  '/feed/:userID',
  authenticateJWT,
  verify.isUser,
  sessionsController.feed
);

// All sessions by specific user
router.get(
  '/user/:userID/',
  authenticateJWT,
  verify.userExists,
  sessionsController.overviews
);

// ***** Comments *****

// All comments for Session
router.get(
  '/:sessionID/comments',
  authenticateJWT,
  verify.sessionExists,
  commentsController.all
);

// Create new comment
router.post(
  '/:sessionID/comments/',
  authenticateJWT,
  verify.sessionExists,
  commentsController.new
);

// TODO: ADD - Update comment
router.put('/:sessionID/comments/:commentID');

// TODO: Add -Delete comment
router.delete(
  '/:sessionID/comments/:commentID',
  authenticateJWT,
  verify.commentExists,
  verify.isCommentOwner,
  commentsController.delete
);

// Like comment
router.put(
  '/:sessionID/comments/:commentID/like',
  authenticateJWT,
  verify.commentExists,
  commentsController.like
);

// Unlike comment
router.delete(
  '/:sessionID/comments/:commentID/like',
  authenticateJWT,
  verify.commentExists,
  commentsController.unlike
);

module.exports = router;
