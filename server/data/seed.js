const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gemstone = require('../models/Gemstone');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const gemstones = [
  {
    name: 'Blue Sapphire (Neelam)',
    description: 'One of the most powerful and fast-acting gemstones in Vedic astrology. It can bring immense wealth, fame, and success when aligned with your chart. Associated with the mighty Saturn.',
    color: 'Blue',
    zodiacSigns: ['Capricorn', 'Aquarius', 'Libra', 'Taurus'],
    rulingPlanet: 'Saturn',
    benefits: ['Wealth', 'Career', 'Protection', 'Fame'],
    imageUrl: '/images/blue_sapphire.png',
    priceRange: '₹5,000 - ₹2,00,000',
    chakra: 'Third Eye',
    hardness: '9',
    origin: 'Sri Lanka, Kashmir, Myanmar',
    wearingFinger: 'Middle Finger',
    wearingDay: 'Saturday',
    category: 'Precious'
  },
  {
    name: 'Emerald (Panna)',
    description: 'Known as the stone of successful love and communication. It enhances intellectual abilities and brings domestic bliss. Blessed by Mercury.',
    color: 'Green',
    zodiacSigns: ['Gemini', 'Virgo'],
    rulingPlanet: 'Mercury',
    benefits: ['Health', 'Wealth', 'Wisdom', 'Career'],
    imageUrl: '/images/emerald.png',
    priceRange: '₹3,000 - ₹1,50,000',
    chakra: 'Heart',
    hardness: '7.5-8',
    origin: 'Colombia, Zambia, Brazil',
    wearingFinger: 'Little Finger',
    wearingDay: 'Wednesday',
    category: 'Precious'
  },
  {
    name: 'Yellow Sapphire (Pukhraj)',
    description: 'A highly auspicious and beneficial stone ruled by Jupiter. It brings prosperity, wisdom, good health, and is especially recommended for marriage and academic success.',
    color: 'Yellow',
    zodiacSigns: ['Sagittarius', 'Pisces'],
    rulingPlanet: 'Jupiter',
    benefits: ['Wealth', 'Health', 'Marriage', 'Peace'],
    imageUrl: '/images/yellow_sapphire.png',
    priceRange: '₹4,000 - ₹1,80,000',
    chakra: 'Solar Plexus',
    hardness: '9',
    origin: 'Sri Lanka, Thailand',
    wearingFinger: 'Index Finger',
    wearingDay: 'Thursday',
    category: 'Precious'
  },
  {
    name: 'Ruby (Manik)',
    description: 'The king of gems. Represents passion, power, and leadership. Enhances self-confidence and authority. Ruled by the mighty Sun.',
    color: 'Red',
    zodiacSigns: ['Leo', 'Aries', 'Scorpio', 'Sagittarius'],
    rulingPlanet: 'Sun',
    benefits: ['Career', 'Health', 'Fame', 'Leadership'],
    imageUrl: '/images/ruby.png',
    priceRange: '₹8,000 - ₹5,00,000',
    chakra: 'Heart',
    hardness: '9',
    origin: 'Myanmar, Mozambique, Sri Lanka',
    wearingFinger: 'Ring Finger',
    wearingDay: 'Sunday',
    category: 'Precious'
  },
  {
    name: 'Red Coral (Moonga)',
    description: 'Known to bring courage, confidence, and physical strength. It strengthens Mars in your chart, boosting vitality and overcoming obstacles.',
    color: 'Red',
    zodiacSigns: ['Aries', 'Scorpio'],
    rulingPlanet: 'Mars',
    benefits: ['Health', 'Protection', 'Courage'],
    imageUrl: '/images/red_coral.png',
    priceRange: '₹1,000 - ₹15,000',
    chakra: 'Root',
    hardness: '3-4',
    origin: 'Italy, Japan, India',
    wearingFinger: 'Ring Finger',
    wearingDay: 'Tuesday',
    category: 'Semi-Precious'
  },
  {
    name: 'Diamond (Heera)',
    description: 'Brings luxury, love, beauty, and artistic abilities into life. The most coveted gemstone, governed by Venus, the planet of love.',
    color: 'White',
    zodiacSigns: ['Taurus', 'Libra', 'Gemini', 'Virgo', 'Aquarius', 'Capricorn'],
    rulingPlanet: 'Venus',
    benefits: ['Love', 'Wealth', 'Beauty', 'Peace'],
    imageUrl: '/images/diamond.png',
    priceRange: '₹25,000 - ₹10,00,000+',
    chakra: 'Crown',
    hardness: '10',
    origin: 'South Africa, Russia, India',
    wearingFinger: 'Ring Finger',
    wearingDay: 'Friday',
    category: 'Precious'
  },
  {
    name: 'Pearl (Moti)',
    description: 'A calming gemstone that controls emotions, brings peace of mind, and enhances the Moon\'s positive influence. Excellent for mental clarity.',
    color: 'White',
    zodiacSigns: ['Cancer'],
    rulingPlanet: 'Moon',
    benefits: ['Peace', 'Health', 'Love', 'Wisdom'],
    imageUrl: '/images/pearl.png',
    priceRange: '₹1,500 - ₹50,000',
    chakra: 'Sacral',
    hardness: '2.5-4.5',
    origin: 'Japan, Australia, India',
    wearingFinger: 'Little Finger',
    wearingDay: 'Monday',
    category: 'Precious'
  },
  {
    name: 'Hessonite Garnet (Gomed)',
    description: 'The stone of Rahu — removes confusion, provides clarity of thought, and protects against negative energies. A powerful remedy stone.',
    color: 'Brown',
    zodiacSigns: ['Aquarius', 'Capricorn'],
    rulingPlanet: 'Rahu',
    benefits: ['Protection', 'Career', 'Wealth'],
    imageUrl: '/images/hessonite_garnet.png',
    priceRange: '₹800 - ₹25,000',
    chakra: 'Root',
    hardness: '7-7.5',
    origin: 'Sri Lanka, India, Africa',
    wearingFinger: 'Middle Finger',
    wearingDay: 'Saturday',
    category: 'Semi-Precious'
  },
  {
    name: "Cat's Eye (Lehsunia)",
    description: 'Stone of Ketu — provides spiritual enlightenment, protection from evil eye, and helps overcome hidden enemies. Displays a mystical chatoyancy.',
    color: 'Green',
    zodiacSigns: ['Pisces', 'Sagittarius'],
    rulingPlanet: 'Ketu',
    benefits: ['Protection', 'Peace', 'Wisdom'],
    imageUrl: '/images/cats_eye.png',
    priceRange: '₹1,000 - ₹30,000',
    chakra: 'Third Eye',
    hardness: '8.5',
    origin: 'Sri Lanka, Brazil, India',
    wearingFinger: 'Middle Finger',
    wearingDay: 'Tuesday',
    category: 'Semi-Precious'
  },
  {
    name: 'Amethyst (Jamunia)',
    description: 'A powerful spiritual stone that enhances intuition, calms the mind, and promotes sobriety. Excellent for meditation and stress relief.',
    color: 'Purple',
    zodiacSigns: ['Pisces', 'Aquarius', 'Capricorn', 'Virgo'],
    rulingPlanet: 'Saturn',
    benefits: ['Peace', 'Wisdom', 'Health', 'Protection'],
    imageUrl: '/images/amethyst.png',
    priceRange: '₹300 - ₹8,000',
    chakra: 'Crown',
    hardness: '7',
    origin: 'Brazil, Uruguay, Zambia',
    wearingFinger: 'Middle Finger',
    wearingDay: 'Saturday',
    category: 'Semi-Precious'
  },
  {
    name: 'Opal (Dudhiya)',
    description: 'A mesmerizing play-of-color gemstone that enhances creativity and passion. A cost-effective alternative to Diamond for Venus.',
    color: 'White',
    zodiacSigns: ['Taurus', 'Libra'],
    rulingPlanet: 'Venus',
    benefits: ['Love', 'Beauty', 'Wealth', 'Career'],
    imageUrl: '/images/opal.png',
    priceRange: '₹500 - ₹15,000',
    chakra: 'Heart',
    hardness: '5.5-6.5',
    origin: 'Australia, Ethiopia, Mexico',
    wearingFinger: 'Ring Finger',
    wearingDay: 'Friday',
    category: 'Semi-Precious'
  },
  {
    name: 'Blue Topaz',
    description: 'A stone of communication and truth. It enhances clarity of expression and brings good fortune. A calming and soothing energy.',
    color: 'Blue',
    zodiacSigns: ['Sagittarius', 'Scorpio'],
    rulingPlanet: 'Jupiter',
    benefits: ['Wisdom', 'Career', 'Peace', 'Health'],
    imageUrl: '/images/blue_topaz.png',
    priceRange: '₹500 - ₹12,000',
    chakra: 'Throat',
    hardness: '8',
    origin: 'Brazil, Nigeria, Sri Lanka',
    wearingFinger: 'Index Finger',
    wearingDay: 'Thursday',
    category: 'Semi-Precious'
  },
  {
    name: 'Turquoise (Firoza)',
    description: 'An ancient talisman of kings and warriors. It brings good luck, protects travelers, and enhances leadership qualities.',
    color: 'Blue',
    zodiacSigns: ['Sagittarius', 'Pisces', 'Aquarius'],
    rulingPlanet: 'Jupiter',
    benefits: ['Protection', 'Leadership', 'Wealth', 'Health'],
    imageUrl: '/images/turquoise.png',
    priceRange: '₹200 - ₹5,000',
    chakra: 'Throat',
    hardness: '5-6',
    origin: 'Iran, USA, Tibet',
    wearingFinger: 'Ring Finger',
    wearingDay: 'Thursday',
    category: 'Semi-Precious'
  },
  {
    name: 'Moonstone (Chandrakant)',
    description: 'A divine feminine stone that enhances intuition, promotes inner growth, and balances emotions. Radiates the soft glow of the Moon.',
    color: 'White',
    zodiacSigns: ['Cancer', 'Libra', 'Scorpio'],
    rulingPlanet: 'Moon',
    benefits: ['Love', 'Peace', 'Health', 'Wisdom'],
    imageUrl: '/images/moonstone.png',
    priceRange: '₹300 - ₹10,000',
    chakra: 'Crown',
    hardness: '6-6.5',
    origin: 'Sri Lanka, India, Madagascar',
    wearingFinger: 'Little Finger',
    wearingDay: 'Monday',
    category: 'Semi-Precious'
  },
  {
    name: 'Tiger Eye',
    description: 'A stone of courage and confidence. It helps release fear and anxiety, promoting clarity and grounded energy. Excellent for decision-making.',
    color: 'Brown',
    zodiacSigns: ['Leo', 'Capricorn'],
    rulingPlanet: 'Sun',
    benefits: ['Courage', 'Career', 'Protection', 'Wealth'],
    imageUrl: '/images/tiger_eye.png',
    priceRange: '₹200 - ₹3,000',
    chakra: 'Solar Plexus',
    hardness: '7',
    origin: 'South Africa, India, Australia',
    wearingFinger: 'Ring Finger',
    wearingDay: 'Sunday',
    category: 'Semi-Precious'
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for Seeding...');
    await Gemstone.deleteMany({});
    console.log('Cleared existing gemstones.');
    await Gemstone.insertMany(gemstones);
    console.log(`Successfully seeded ${gemstones.length} gemstones!`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
