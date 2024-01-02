const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, required: true },
  modificationDate: { type: Date, required: true },
  creationUser: { type: String, required: true },
  modificationUser: { type: String, required: true },
  active: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
