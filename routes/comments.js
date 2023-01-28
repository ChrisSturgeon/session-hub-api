const express = require('express');
const router = express.Router();
const authenticateJWT = require('../protected.js');
const comments_controller = require('../controllers/comments_controller');

// Comment creation, editing, and deletion

// Create new post for given SessionID
router.post('/:sessionID', authenticateJWT, comments_controller.new);

// Retrieving comments
router.get('/:sessionID/', authenticateJWT, comments_controller.all);

// Liking & Unliking Comment
router.put('/:commentID/like');
router.delete('/:commentID/like');

module.exports = router;
