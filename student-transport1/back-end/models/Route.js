// back-end/models/Route.js
const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  time:    { type: String, required: true },             // e.g. "07:00"
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  address: { type: String, required: true }
});

const RouteSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  stops:     [StopSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);
