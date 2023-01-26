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

module.exports = router;
