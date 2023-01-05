const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  author: { type: String, required: true },
  authorID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  content: { type: String, maxLength: 100 },
  posted: { type: Date, required: true },
  sport: { type: String, maxLength: 20 },
  comments: [],
  likes: [],
});

module.exports = mongoose.model('Session', SessionSchema);
