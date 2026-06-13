const mongoose = require('mongoose');

const gemstoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  zodiacSigns: [{
    type: String
  }],
  rulingPlanet: {
    type: String
  },
  benefits: [{
    type: String
  }],
  imageUrl: {
    type: String,
    required: true
  },
  priceRange: {
    type: String
  },
  chakra: {
    type: String
  },
  hardness: {
    type: String
  },
  origin: {
    type: String
  },
  wearingFinger: {
    type: String
  },
  wearingDay: {
    type: String
  },
  category: {
    type: String,
    enum: ['Precious', 'Semi-Precious', 'Rare'],
    default: 'Semi-Precious'
  }
}, { timestamps: true });

module.exports = mongoose.model('Gemstone', gemstoneSchema);
