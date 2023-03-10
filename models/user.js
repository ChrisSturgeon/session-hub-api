const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxLength: 20, minLength: 3, required: true },
  password: { type: String, maxLength: 200, minLength: 6, required: true },
  bio: { type: String, maxLength: 2000 },
  profileComplete: { type: Boolean },
  joined: { type: Date, required: true },
  friends: [],
  friendRequests: [],
  sports: [],
  imgURL: { type: String, maxLength: 1000 },
  thumbURL: { type: String, maxLength: 1000 },
});

module.exports = mongoose.model('User', UserSchema);
