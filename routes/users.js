const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const authenticateJWT = require('../protected.js');
const verify = require('../verify');

// *** Registration, Login & Auth ***

// Register new user on POST
router.post('/register', usersController.registerPOST);

// Login user on POST
router.post('/login', usersController.loginPOST);

// Authenticates JWT and returns user details
router.get('/authenticate', authenticateJWT, usersController.authenticateGET);

// *** Users & Profiles***

// All registered users
router.get('/', authenticateJWT, usersController.all);

// Profile details for individual user
router.get('/profile/:userID', authenticateJWT, usersController.profile);

// Update profile details for individual user
router.put(
  '/profile/:userID',
  authenticateJWT,
  verify.isUser,
  usersController.profileUpdate
);

// 6 most recently joined users
router.get('/latest', authenticateJWT, usersController.latestUsers);

module.exports = router;
