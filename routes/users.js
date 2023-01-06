const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userController.registerPOST);
module.exports = router;
