const Session = require('./models/session');
const Comment = require('./models/comment');
const User = require('./models/user');
const FriendRequest = require('./models/friendRequest');

exports.isUser = function (req, res, next) {
  if (req.tokenID.toString() === req.params.userID) {
    next();
  } else {
    res
      .status(403)
      .json({ status: 'fail', data: null, message: 'Unauthorized' });
    return;
  }
};

exports.userExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userID);
    if (!user) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'User not found',
      });
      return;
    }
    req.existingUser = user;
    next();
  } catch (err) {
    return next(err);
  }
};

exports.sessionExists = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.sessionID);
    if (!session) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'Session not found',
      });
      return;
    }
    req.session = session;
    next();
  } catch (err) {
    return next(err);
  }
};

exports.isSessionOwner = async (req, res, next) => {
  try {
    if (req.session.userID.toString() !== req.user._id.toString()) {
      res.status(403).json({
        status: 'fail',
        data: null,
        message: 'You are not authorised to access this resource',
      });
      return;
    }
  } catch (err) {
    return next(err);
  }
  next();
};

exports.commentExists = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentID);
  if (!comment) {
    res.status(404).json({
      status: 'fail',
      data: null,
      message: `cannot find comment ${req.params.commentID}`,
    });
    return;
  }
  (req.comment = comment), next();
};

exports.isCommentOwner = async (req, res, next) => {
  if (req.comment.userID.toString() !== req.user._id.toString()) {
    res.status(403).json({
      status: 'fail',
      data: null,
      message: 'You are not authorised to access this resource',
    });
    return;
  }
  next();
};

// **** Friends Request Middleware ****

exports.friendRequestExists = async (req, res, next) => {
  try {
    const friendRequest = await FriendRequest.findById(req.params.requestID);
    if (!friendRequest) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'Friend request not found',
      });
      return;
    }
    req.friendRequest = friendRequest;
    next();
  } catch (err) {
    return next(err);
  }
};

exports.userIsFriendRequestOwner = async (req, res, next) => {
  try {
    if (req.friendRequest.requestee.ID.toString() !== req.user._id.toString()) {
      res.status(401).json({
        status: 'fail',
        data: null,
        message: 'You are not authorised to respond to this friend request',
      });
      return;
    }
    next();
  } catch (err) {
    return next(err);
  }
};

exports.friendRequesterExists = async (req, res, next) => {
  try {
    const requester = await User.findById(req.friendRequest.requester.ID);
    if (!requester) {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'The user who sent this request cannot be found',
      });
      return;
    }
    req.requester = requester;

    next();
  } catch (err) {
    return next(err);
  }
};
