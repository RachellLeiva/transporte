// back-end/models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  parent:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  level:   { 
    type: String,
    enum: ['preescolar','primaria','secundaria'],
    required: true
  },
  grade:   { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
