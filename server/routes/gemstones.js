const express = require('express');
const router = express.Router();
const Gemstone = require('../models/Gemstone');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get all gemstones (Public) — with filters
router.get('/', async (req, res) => {
  try {
    const { color, zodiac, category, benefit, search } = req.query;
    let query = {};

    if (color) query.color = color;
    if (zodiac) query.zodiacSigns = zodiac;
    if (category) query.category = category;
    if (benefit) query.benefits = benefit;
    if (search) query.name = { $regex: search, $options: 'i' };

    const gemstones = await Gemstone.find(query);
    res.json(gemstones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single gemstone (Public)
router.get('/:id', async (req, res) => {
  try {
    const gemstone = await Gemstone.findById(req.params.id);
    if (!gemstone) return res.status(404).json({ message: 'Gemstone not found' });
    res.json(gemstone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create gemstone (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const gemstone = new Gemstone(req.body);
    const createdGemstone = await gemstone.save();
    res.status(201).json(createdGemstone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update gemstone (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const gemstone = await Gemstone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gemstone) return res.status(404).json({ message: 'Gemstone not found' });
    res.json(gemstone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gemstone (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const gemstone = await Gemstone.findByIdAndDelete(req.params.id);
    if (!gemstone) return res.status(404).json({ message: 'Gemstone not found' });
    res.json({ message: 'Gemstone removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// AI-Powered Recommendation (Gemini)
router.post('/recommend', async (req, res) => {
  try {
    const { zodiacSign, purpose, name, dob, placeOfBirth, timeOfBirth } = req.body;
    
    // First get matching gemstones from DB
    let query = {};
    if (zodiacSign || purpose) {
      query.$or = [];
      if (zodiacSign) query.$or.push({ zodiacSigns: zodiacSign });
      if (purpose) query.$or.push({ benefits: purpose });
    }
    
    const matchedGemstones = await Gemstone.find(query).limit(6);
    
    // Now use Gemini AI for personalized insight
    let aiInsight = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const gemNames = matchedGemstones.map(g => g.name).join(', ');
      const prompt = `You are a professional Vedic astrologer and gemstone consultant. A person named "${name || 'the seeker'}" with the zodiac sign "${zodiacSign}" born on "${dob || 'unknown'}" at "${timeOfBirth || 'unknown time'}" in "${placeOfBirth || 'unknown place'}" is seeking gemstones for "${purpose}".

The matching gemstones from our catalog are: ${gemNames}.

Provide a concise, personalized astrological insight (3-4 sentences max) explaining why these gemstones are aligned with their cosmic energy. Mention specific planetary alignments if relevant. Be mystical yet professional. Do NOT use markdown formatting.`;

      const result = await model.generateContent(prompt);
      aiInsight = result.response.text();
    } catch (aiErr) {
      console.error('Gemini AI error:', aiErr.message);
      aiInsight = `Based on your ${zodiacSign} zodiac alignment and your pursuit of ${purpose}, these gemstones resonate deeply with your cosmic energy. Wearing them on the recommended day can amplify their astrological benefits.`;
    }

    // Save to recommendation history if user is authenticated
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        await User.findByIdAndUpdate(decoded.id, {
          $push: {
            recommendationHistory: {
              zodiacSign,
              purpose,
              gemstones: matchedGemstones.map(g => g._id),
              aiInsight
            }
          }
        });
      } catch (e) {
        // ignore auth errors for recommendation saving
      }
    }

    res.json({ gemstones: matchedGemstones, aiInsight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
