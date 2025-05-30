// back-end/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     {
    type: String,
    enum: ['parent','admin','finance'],
    default: 'parent'
  },
  serviceType: {
    type: String,
    enum: ['both','pickup','dropoff'],
    default: 'both'
  },
  amount: {
    type: Number,
    default: 120
  },
  // ** NUEVOS CAMPOS **
  resetPasswordToken:  String,
  resetPasswordExpire: Date
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
