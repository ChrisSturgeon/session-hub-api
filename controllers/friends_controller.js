const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Creates new friends request document
exports.requestCreate = async (req, res, next) => {
  try {
    const requester = await User.findById(req.user._id);
    const requestee = await User.findById(req.body.requesteeID);

    if (requestee && requester) {
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

        await friendRequest.save();

        res.status(201).json({
          status: 'success',
          data: null,
          message: 'friend request created',
        });
      }
    } else {
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

exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const friendsSince = new Date();

    await User.findByIdAndUpdate(req.friendRequest.requester.ID, {
      $push: {
        friends: {
          ID: req.user._id,
          name: req.user.username,
          since: friendsSince,
        },
      },
    });

    await User.findByIdAndUpdate(req.friendRequest.requestee.ID, {
      $push: {
        friends: {
          ID: req.requester._id,
          name: req.requester.username,
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
  } catch (err) {
    return next(err);
  }
};
exports.declineFriendRequest = async (req, res, next) => {
  try {
    await FriendRequest.findByIdAndDelete(req.params.requestID);
    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Friend request declined and deleted',
    });
  } catch (err) {
    return next(err);
  }
};

// Returns friends list as array in JSON for given userID
exports.allFriends = async (req, res, next) => {
  try {
    // const user = await User.findById(req.params.userID);

    const filter = { _id: ObjectId(req.params.userID) };

    const friends = await User.aggregate([
      { $match: filter },
      { $project: { friends: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends.ID',
          foreignField: '_id',
          as: 'friends',
          pipeline: [
            {
              $project: {
                thumbURL: 1,
                username: 1,
              },
            },
          ],
        },
      },
    ]);

    if (friends) {
      res.status(200).json({
        status: 'success',
        data: friends,
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
    const filter = {
      'requestee.ID': ObjectId(req.user._id),
      status: 'pending',
    };

    const requests = await FriendRequest.aggregate([
      { $match: filter },
      { $project: { _id: 1, requester: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'requester.ID',
          foreignField: '_id',
          as: 'requesterDetails',
          pipeline: [
            {
              $project: {
                thumbURL: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          requester: 0,
        },
      },
    ]);

    if (requests.length > 0) {
      res.status(200).json({
        status: 'success',
        requesteeID: req.user._id,
        data: requests,
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

exports.recent = async (req, res, next) => {
  try {
    const recentFriends = await User.find(
      { _id: req.user._id },
      'friends'
    ).sort({ since: 1 });

    if (recentFriends) {
      res.status(200).json({
        status: 'success',
        data: recentFriends,
        message: 'recent friends',
      });
      return;
    }
    res.status(404).json({
      status: 'fail',
      data: null,
      message: 'No recent friends found',
    });
  } catch (err) {
    return next(err);
  }
};
