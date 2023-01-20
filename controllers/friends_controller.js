const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');

// Creates new friends request document
exports.requestCreate = async (req, res, next) => {
  // Check to make sure both users existing in database
  try {
    const requester = await User.findById(req.userID);
    const requestee = await User.findById(req.body.userID);

    if (requestee && requester) {
      // Check no pending request between users already exists
      const existingRequest = await FriendRequest.findOne({
        'requester.ID': `${requester._id}`,
        'requestee.ID': `${requestee._id}`,
      });

      if (existingRequest) {
        res.status(400).json({
          status: 'fail',
          data: null,
          message: 'Friend request already exists',
        });
      } else {
        // Create friend request object
        const friendRequest = new FriendRequest({
          requester: {
            ID: requester._id,
            name: requester.username,
          },
          requestee: {
            ID: requestee._id,
            name: requestee.username,
          },
          sent: new Date(),
          status: 'pending',
        });
        // Save request in database and return success json
        await friendRequest.save();

        res.status(201).json({
          status: 'success',
          data: null,
          message: 'friend request created',
        });
      }
    } else {
      // Either or both users not found in database so return failure json
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'One or more users not found',
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.requestRespond = async (req, res, next) => {
  try {
    // Check request still exists
    const friendRequest = await FriendRequest.findById(req.params.requestID);

    if (friendRequest.requestee.ID.toString() !== req.userID.toString()) {
      res.status(401).json({
        status: 'fail',
        data: null,
        message: 'You are not authorised to respond to this friend request',
      });
      return;
    }

    if (friendRequest) {
      // If request is declined delete request from database

      if (req.body.accepted === 'false') {
        await FriendRequest.findByIdAndRemove(req.params.requestID);
        res.status(200).json({
          status: 'success',
          data: null,
          message: 'Friend request declined and deleted',
        });
      } else if (req.body.accepted === 'true') {
        // Request has been accepted -
        // Check friend requester still exists
        const requester = await User.findById(friendRequest.requester.ID);
        const requestee = await User.findById(friendRequest.requestee.ID);

        if (requester) {
          // Add friends to each others users documents and update status of friend request
          const friendsSince = new Date();

          await User.findByIdAndUpdate(friendRequest.requester.ID, {
            $push: {
              friends: {
                ID: requestee._id,
                name: requestee.username,
                since: friendsSince,
              },
            },
          });

          await User.findByIdAndUpdate(friendRequest.requestee.ID, {
            $push: {
              friends: {
                ID: requester._id,
                name: requester.username,
                since: friendsSince,
              },
            },
          });

          await FriendRequest.findByIdAndUpdate(req.params.requestID, {
            status: 'accepted',
          });

          res.status(200).json({
            status: 'success',
            data: null,
            message: 'Friends accepted',
          });
        } else {
          res.status(404).json({
            status: 'fail',
            data: null,
            message: 'Friend requester no longer exists',
          });
        }
      } else {
        res.status(400).json({
          status: 'fail',
          data: null,
          message: 'Bad request - no response to friend request provided',
        });
      }
    } else {
      // Friend request not found
      res.status(404).json({
        status: 'success',
        data: null,
        message: 'Friend request not found',
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Returns friends list as array in JSON for given userID
exports.allFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userID);

    if (user) {
      res.status(200).json({
        status: 'success',
        data: user.friends,
        message: 'Friends list',
      });
    } else {
      res.status(404).json({
        status: 'fail',
        data: null,
        message: 'No user data found',
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Returns array of pending friend requests
exports.allRequests = async (req, res, next) => {
  try {
    const pendingRequests = await FriendRequest.find({
      'requestee.ID': req.userID,
      status: 'pending',
    });

    if (pendingRequests.length) {
      res.status(200).json({
        status: 'success',
        requesteeID: req.userID,
        data: pendingRequests,
        message: 'Found Pending friend requests',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: null,
        message: 'No pending friend requests found',
      });
    }
  } catch (err) {
    return next(err);
  }
};