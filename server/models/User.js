const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  dob: {
    type: Date
  },
  zodiacSign: {
    type: String
  },
  placeOfBirth: {
    type: String
  },
  savedGemstones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gemstone'
  }],
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gemstone'
  }],
  purchases: [{
    gemstone: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' },
    purchasedAt: { type: Date, default: Date.now },
    quantity: { type: Number, default: 1 }
  }],
  recommendationHistory: [{
    zodiacSign: String,
    purpose: String,
    gemstones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' }],
    aiInsight: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
