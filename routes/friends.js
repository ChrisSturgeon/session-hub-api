const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends_controller');
const authenticateJWT = require('../protected.js');
const verify = require('../verify');

// Creates new friends request
router.post(
  '/request/:userID',
  authenticateJWT,
  verify.userExists,
  friendsController.newRequest
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
router.get('/request/:userID', authenticateJWT, friendsController.allRequests);

// All friends of user
router.get(
  '/:userID/all',
  authenticateJWT,
  verify.userExists,
  friendsController.allFriends
);

// Returns 10 most recent friends of user
router.get(
  '/recent',
  authenticateJWT,
  verify.userExists,
  friendsController.recent
);

module.exports = router;
