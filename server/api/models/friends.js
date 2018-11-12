const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  user: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    email: { type: String, required: true },
  },
  confirmed: { type: Boolean, required: true },
  publishedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Friends', friendsSchema);

