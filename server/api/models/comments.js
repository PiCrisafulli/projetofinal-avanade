const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  postId: mongoose.Types.ObjectId,
  text: { type: String, required: true },
  user: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    email: { type: String, required: true }
  },
  publishedAt: { type: Date, required: true },
  modifiedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Comments', commentsSchema);