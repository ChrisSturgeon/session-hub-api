const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const authenticateJWT = require('../protected.js');

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });

// ***** Registration, Login & Auth *****

// Register new user on POST
router.post('/register', usersController.registerPOST);

// Login user on POST
router.post('/login', usersController.loginPOST);

// Authenticates JWT and returns user details
router.get('/authenticate', authenticateJWT, usersController.authenticateGET);

// ***** User Profiles *****

// All registered users
router.get('/', authenticateJWT, usersController.all);

// Profile details for individual user
router.get('/profile/:userID', authenticateJWT, usersController.profile);

// Update profile picture URL
router.put(
  '/profile/:userID/picture',
  authenticateJWT,
  usersController.updateProfilePhoto
);

module.exports = router;
