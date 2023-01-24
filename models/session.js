const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  userID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  username: { type: String, required: true },
  description: { type: String, maxLength: 2000 },
  createdDate: { type: Date, required: true },
  activityDate: { type: Date, required: true },
  sport: { type: String, maxLength: 20 },
  locationName: { type: String, maxLength: 30 },
  coords: { type: Array, maxLength: 2 },
  equipment: { type: Object },
  likes: [],
});

module.exports = mongoose.model('Session', SessionSchema);
