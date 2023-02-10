const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends_controller');
const authenticateJWT = require('../protected.js');
const verify = require('../verify');

// Creates new friends request
router.post(
  '/request/create',
  authenticateJWT,
  friendsController.requestCreate
);

// Accepts friends request
router.put(
  '/request/:requestID',
  authenticateJWT,
  verify.friendRequestExists,
  verify.userIsFriendRequestOwner,
  verify.friendRequesterExists,
  friendsController.acceptFriendRequest
);

// Declines friends request
router.delete(
  '/request/:requestID',
  authenticateJWT,
  verify.friendRequestExists,
  verify.userIsFriendRequestOwner,
  friendsController.declineFriendRequest
);

// All friends requests for user
router.get('/request/all', authenticateJWT, friendsController.allRequests);

router.get(
  '/request/user/:userID/all',
  authenticateJWT,
  verify.isUser,
  friendsController.allRequests
);

// All friends of user
router.get('/:userID/all', authenticateJWT, friendsController.allFriends);

// Returns 10 most recent friends of user
router.get('/recent', authenticateJWT, friendsController.recent);

module.exports = router;
