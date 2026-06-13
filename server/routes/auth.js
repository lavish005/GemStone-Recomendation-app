const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const getZodiacSign = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "";
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob, placeOfBirth } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const zodiacSign = dob ? getZodiacSign(dob) : '';

    user = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      placeOfBirth,
      zodiacSign
    });

    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, zodiacSign: user.zodiacSign } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, zodiacSign: user.zodiacSign } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile (full)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('savedGemstones')
      .populate('watchlist')
      .populate('purchases.gemstone')
      .populate('recommendationHistory.gemstones');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, dob, placeOfBirth, zodiacSign } = req.body;
    const update = {};
    if (name) update.name = name;
    if (dob) {
      update.dob = dob;
      // Only auto-calculate if user didn't explicitly provide a zodiacSign
      if (!zodiacSign) {
        update.zodiacSign = getZodiacSign(dob);
      }
    }
    if (zodiacSign) {
      update.zodiacSign = zodiacSign;
    }
    if (placeOfBirth) update.placeOfBirth = placeOfBirth;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle watchlist
router.post('/watchlist/:gemstoneId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const idx = user.watchlist.indexOf(req.params.gemstoneId);
    if (idx > -1) {
      user.watchlist.splice(idx, 1);
    } else {
      user.watchlist.push(req.params.gemstoneId);
    }
    await user.save();
    const populated = await User.findById(req.user.id).select('-password').populate('watchlist');
    res.json(populated.watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add purchase
router.post('/purchase/:gemstoneId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.purchases.push({ gemstone: req.params.gemstoneId, quantity: req.body.quantity || 1 });
    await user.save();
    const populated = await User.findById(req.user.id).select('-password').populate('purchases.gemstone');
    res.json(populated.purchases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save gemstone to saved list
router.post('/save/:gemstoneId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const idx = user.savedGemstones.indexOf(req.params.gemstoneId);
    if (idx > -1) {
      user.savedGemstones.splice(idx, 1);
    } else {
      user.savedGemstones.push(req.params.gemstoneId);
    }
    await user.save();
    const populated = await User.findById(req.user.id).select('-password').populate('savedGemstones');
    res.json(populated.savedGemstones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
