const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plantSchema = new Schema({
  plantname: { type: String, required: true },
  watersperday: { type: Number, required: true },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true
  },
  plants: [plantSchema],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;