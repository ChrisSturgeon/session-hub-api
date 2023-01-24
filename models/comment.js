const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  sessionID: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
  userID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  username: { type: String, required: true },
  text: { type: String, maxLength: 1000 },
  createdDate: { type: Date },
  likes: [],
});

module.exports = mongoose.model('Comment', CommentSchema);
