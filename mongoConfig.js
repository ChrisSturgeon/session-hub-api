const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Setup

const mongoStart = () => {
  const mongoDb = process.env.MONGODB_URI;
  mongoose.set('strictQuery', true);
  mongoose.connect(mongoDb, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongo connection error'));
};

module.exports = mongoStart;
