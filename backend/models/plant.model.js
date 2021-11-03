const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plantSchema = new Schema({
  username: { type: String, required: true },
  plantname: { type: String, required: true },
  watersperday: { type: Number, required: true },
}, {
  timestamps: true,
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;