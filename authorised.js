module.exports = function (req, res, next) {
  if (req.tokenID.toString() === req.params.userID) {
    next();
  } else {
    res
      .status(403)
      .json({ status: 'fail', data: null, message: 'Unauthorized' });
    return;
  }
};
