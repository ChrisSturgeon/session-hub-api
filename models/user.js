const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxLength: 20, minLength: 3, required: true },
  password: { type: String, maxLength: 20, minLength: 6, required: true },
  bio: { type: String, maxLength: 500 },
  joined: { type: Date, required: true },
  friends: [],
  friendRequests: [],
  sports: [],
});

module.exports = mongoose.model('User', UserSchema);
