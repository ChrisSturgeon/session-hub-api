const express = require('express');
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

router.post('/test', userController.test);
module.exports = router;
