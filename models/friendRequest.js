const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequest = new Schema({
  requester: {
    ID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String },
  },
  requestee: {
    ID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String },
  },
  sent: { type: Date, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('FriendRequest', FriendRequest);
