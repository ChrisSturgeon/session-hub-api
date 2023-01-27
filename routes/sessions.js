const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessions_controller');
const commentsController = require('../controllers/comments_controller');
const authenticateJWT = require('../protected.js');

router.get(
  '/user/:userID/overviews',
  authenticateJWT,
  sessionsController.overviews
);

router.get('/:sessionID', authenticateJWT, sessionsController.detail);

router.post('/new', authenticateJWT, sessionsController.new);

router.post(
  '/:sessionID/comments/new',
  authenticateJWT,
  commentsController.new
);

router.get('/:sessionID/comments/all', authenticateJWT, commentsController.all);

router.put(
  '/:sessionID/comments/:commentID/like',
  authenticateJWT,
  commentsController.like
);

router.get(
  '/:sessionID/comments/:commentID/test',
  authenticateJWT,
  commentsController.testAggregation
);

// Adds or removes user from sessesion's likes array for given sessionID
router.put('/:sessionID/like', authenticateJWT, sessionsController.like);

// Returns JSON with latest sessions of user's friends
router.get('/feed/:userID', authenticateJWT, sessionsController.feed);

module.exports = router;
