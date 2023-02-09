const express = require('express');
const router = express.Router();
const authenticateJWT = require('../protected.js');
const verifyUser = require('../authorised');

// Controller imports
const sessionsController = require('../controllers/sessions_controller');
const commentsController = require('../controllers/comments_controller');

// ***** Sessions *****

// Create new session
router.post('/', authenticateJWT, sessionsController.new);

// Like session
router.put('/:sessionID/like', authenticateJWT, sessionsController.like);

router.put('/:sessionID', authenticateJWT, sessionsController.update);

// Return all details for specific session
router.get('/:sessionID', authenticateJWT, sessionsController.detail);

// Unlike session
router.delete('/:sessionID/like', authenticateJWT, sessionsController.unlike);

// ***** Feeds *****

// Feed of latest posts by friends for given user
router.get(
  '/feed/:userID',
  authenticateJWT,
  verifyUser,
  sessionsController.feed
);

// All sessions by specific user
router.get('/user/:userID/', authenticateJWT, sessionsController.overviews);

// ***** Comments *****

// All comments for Session
router.get('/:sessionID/comments', authenticateJWT, commentsController.all);

// Create new comment
router.post('/:sessionID/comments/', authenticateJWT, commentsController.new);

// TODO: ADD - Update comment
router.put('/:sessionID/comments/:commentID');

// TODO: Add -Delete comment
router.delete('/:sessionID/comments/:commentID');

// Like comment
router.put(
  '/:sessionID/comments/:commentID/like',
  authenticateJWT,
  commentsController.like
);

// Unlike comment
router.delete(
  '/:sessionID/comments/:commentID/like',
  authenticateJWT,
  commentsController.unlike
);

module.exports = router;
