const mongoose = require('mongoose');

const placesSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  user: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    email: { type: String, required: true },
  },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  comments: { type: String, required: true },
  avaliation: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  modifiedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Places', placesSchema);

