const express = require('express');
const router = express.Router();

const usersRouter = require('../routes/users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.post('/', function (req, res, next) {
  console.log('hi');
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'This was a post route to /',
  });
});
