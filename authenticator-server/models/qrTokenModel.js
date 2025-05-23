const mongoose = require('mongoose');

const qrTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: { type: String, default: null }, 
  scanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 300 }, 
});

module.exports = mongoose.model('QRToken', qrTokenSchema);
