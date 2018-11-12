const mongoose = require('mongoose');
const userSchema = require('./users');

const friendsSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  user: userSchema,
  confirmed: { type: Boolean, required: true },
  publishedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Friends', friendsSchema);

