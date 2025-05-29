const mongoose = require('mongoose');
const ReceiptSchema = new mongoose.Schema({
  parent:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year:    { type: Number, required: true },
  month:   { type: Number, required: true },
  type:    { type: String, required: true },
  amount:  { type: Number, required: true },
  status:  { type: String, default: 'pending' },
  fileUrl: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Receipt', ReceiptSchema);