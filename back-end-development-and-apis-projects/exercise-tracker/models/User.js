let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
});

module.exports = mongoose.model('User', userSchema);
