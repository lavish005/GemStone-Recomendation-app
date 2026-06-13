const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Lavish Garg\\.gemini\\antigravity-ide\\brain\\2984f3af-bab4-4423-a67f-c125085e3a9a';
const destDir = path.join(__dirname, '../client/public/images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 1. Copy the 12 generated PNGs
const pngMap = {
  'blue_sapphire': 'blue_sapphire_1781321349416.png',
  'diamond': 'diamond_1781321412759.png',
  'emerald': 'emerald_1781321362630.png',
  'red_coral': 'red_coral_1781321398489.png',
  'ruby': 'ruby_1781321387010.png',
  'yellow_sapphire': 'yellow_sapphire_1781321373158.png',
  'pearl': 'pearl_1_1781324513020.png',
  'hessonite_garnet': 'hessonite_garnet_1781324531731.png',
  'cats_eye': 'cats_eye_1781324543458.png',
  'amethyst': 'amethyst_1781324553685.png',
  'opal': 'opal_1781324564631.png',
  'blue_topaz': 'blue_topaz_1781324580649.png'
};

for (const [name, filename] of Object.entries(pngMap)) {
  const src = path.join(srcDir, filename);
  const dest = path.join(destDir, `${name}.png`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${filename} to ${name}.png`);
  } else {
    console.warn(`File not found: ${src}`);
  }
}

// 2. Generate premium SVG gradients for the remaining 3 that hit the quota
const svgs = [
  { name: 'turquoise', color1: '#0d9488', color2: '#2dd4bf', text: 'Turquoise' },
  { name: 'moonstone', color1: '#0f172a', color2: '#334155', text: 'Moonstone' },
  { name: 'tiger_eye', color1: '#451a03', color2: '#b45309', text: 'Tiger Eye' }
];

svgs.forEach(gem => {
  const textColor = ['moonstone'].includes(gem.name) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)';
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${gem.name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gem.color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${gem.color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad-${gem.name})" />
    <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
      ${gem.text}
    </text>
  </svg>`;
  fs.writeFileSync(path.join(destDir, `${gem.name}.svg`), svgContent);
  console.log(`Generated SVG for ${gem.name}`);
});

console.log('All images setup successfully.');
