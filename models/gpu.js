const mongoose = require('mongoose');

const gpuSchema = mongoose.Schema({
  name: String,
  isCoolDowned: Boolean,
});

const Gpu = mongoose.model('Gpu', gpuSchema);

module.exports = Gpu;
