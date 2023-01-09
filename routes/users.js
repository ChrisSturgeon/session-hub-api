const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/users_controller');
const authenticateJWT = require('../protected.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Facebook login route on GET
router.get('/login/facebook', passport.authenticate('facebook'));

router.get(
  '/oauth2/redirect/facebook',
  passport.authenticate('facebook', {
    session: false,
    successRedirect: '',
    failureRedirect: '/login',
    failureMessage: true,
  }),
  (req, res, next) => {
    console.log;
    res.json({
      message: 'Success!',
    });
  }
);

// Login user on POST
router.post('/login', userController.loginPOST);

// Register new user on POST
router.post('/register', userController.registerPOST);

router.get('/protected', authenticateJWT, userController.test);

router.get('/authenticate', authenticateJWT, userController.authenticateGET);

router.post('/test', userController.test);
module.exports = router;
