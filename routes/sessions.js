const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessions_controller');
const authenticateJWT = require('../protected.js');

router.get(
  '/user/:userID/overviews',
  authenticateJWT,
  sessionsController.overviews
);

router.get('/:sessionID', authenticateJWT, sessionsController.detail);

router.post('/new', authenticateJWT, sessionsController.new);

module.exports = router;
