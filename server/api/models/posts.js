const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },
  link: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  user: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    email: { type: String, required: true }
  },
  images: {
    src: { type: String, required: true },
    publishedAt: { type: Date, required: true }
  },
  videos: {
    src: { type: String, required: true },
    publishedAt: { type: Date, required: true }
  },
  comments: {
    postId: mongoose.Types.ObjectId,
    text: { type: String, required: true },
    user: {
      name: { type: String, required: true },
      icon: { type: String, required: true }
    },
    publishedAt: { type: Date, required: true },
    modifiedAt: { type: Date, required: true }
  },
  likes: { type: Number, required: true }
});

module.exports = mongoose.model('Posts', postSchema);