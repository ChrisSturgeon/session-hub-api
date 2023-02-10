const express = require('express');
const router = express.Router();
const comments_controller = require('../controllers/comments_controller');
const authenticateJWT = require('../protected.js');
const verify = require('../verify');

// Comment creation, editing, and deletion

// Create new comment
router.post(
  '/:sessionID',
  authenticateJWT,
  verify.sessionExists,
  comments_controller.new
);

// Retrieving comments
router.get('/:sessionID/', authenticateJWT, comments_controller.all);

// Liking & Unliking Comment
router.put('/:commentID/like');
router.delete('/:commentID/like');

// Deletes comments from database
router.delete(
  '/:commentID',
  authenticateJWT,
  verify.commentExists,
  verify.isCommentOwner,
  comments_controller.delete
);

module.exports = router;
