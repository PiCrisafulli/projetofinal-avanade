const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
  postId: mongoose.Types.ObjectId,
  src: { type: String, required: true },
  publishedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Images', imagesSchema);