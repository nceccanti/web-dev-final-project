const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plantSchema = new Schema({
  username: { type: String, required: true },
  plantname: { type: String, required: true },
  waterperday: { type: Number, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Plant = mongoose.model('Plant', exerciseSchema);

module.exports = Plant;