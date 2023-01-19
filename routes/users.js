const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/users_controller');
const authenticateJWT = require('../protected.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Login user on POST
router.post('/login', userController.loginPOST);

// Register new user on POST
router.post('/register', userController.registerPOST);

router.get('/protected', authenticateJWT, userController.test);

router.get('/authenticate', authenticateJWT, userController.authenticateGET);

router.get('/all', authenticateJWT, userController.all);

router.post('/test', authenticateJWT, userController.test);

router.get('/profile/:userID', authenticateJWT, userController.profile);

module.exports = router;
