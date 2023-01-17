const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends_controller');
const authenticateJWT = require('../protected.js');

router.post(
  '/request/create',
  authenticateJWT,
  friendsController.requestCreate
);

router.post(
  '/request/:requestID/response',
  authenticateJWT,
  friendsController.requestRespond
);

router.get('/request/all', authenticateJWT, friendsController.allRequests);

router.get('/:userID/all', authenticateJWT, friendsController.allFriends);

module.exports = router;
