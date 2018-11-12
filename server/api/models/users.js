const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  email: { type: String, required: true },
  dateBirth: { type: Date, required: true },
  sex: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  typeLogin: { type: String, required: true },
  password: { type: String, required: true },
  biography: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  modifiedAt: { type: Date, required: true }
});

module.exports = mongoose.model('users', userSchema);