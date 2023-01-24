const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessions_controller');
const authenticateJWT = require('../protected.js');

router.get('/:userID/overviews', authenticateJWT, sessionsController.overviews);

router.post('/new', authenticateJWT, sessionsController.new);

module.exports = router;
