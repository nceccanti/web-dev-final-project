const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plantSchema = new Schema({
  plantname: { type: String, required: true },
  daystowater: { type: Number, required: true },
  dateCreated: { type: Date, required: true },
  planttype: { type: Number },
  plantImage: { type: String }
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
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  notifyTime : {
    type: String,
  },
  isEmail: {
    type: Boolean
  },
  isSMS: {
    type: Boolean
  },
  plants: [plantSchema],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;