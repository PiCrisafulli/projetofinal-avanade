const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   icon: { type: String },
   email: { type: String, required: true },
   dateBirth: { type: Date },
   sex: { type: String },
   phoneNumber: { type: String },
   typeLogin: { type: String, required: true },
   password: { type: String, required: true },
   biography: { type: String },
   publishedAt: { type: Date },
   modifiedAt: { type: Date }
});

module.exports = mongoose.model('users', userSchema);
