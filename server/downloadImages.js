const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { name: 'blue_sapphire.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logansapphire.jpg/800px-Logansapphire.jpg' },
  { name: 'emerald.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Emerald_rough_300x422.jpg/440px-Emerald_rough_300x422.jpg' },
  { name: 'yellow_sapphire.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Sapphire_yellow.jpg/440px-Sapphire_yellow.jpg' },
  { name: 'ruby.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ruby_gem.JPG/440px-Ruby_gem.JPG' },
  { name: 'red_coral.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Coral_red.jpg/440px-Coral_red.jpg' },
  { name: 'diamond.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Brillanten.jpg/440px-Brillanten.jpg' },
  { name: 'pearl.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pearls.jpg/440px-Pearls.jpg' },
  { name: 'hessonite_garnet.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hessonite-Garnet-gem.jpg/440px-Hessonite-Garnet-gem.jpg' },
  { name: 'cats_eye.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chrysoberyl_catseye.jpg/440px-Chrysoberyl_catseye.jpg' },
  { name: 'amethyst.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Amethyst._Magaliesburg%2C_South_Africa.jpg/440px-Amethyst._Magaliesburg%2C_South_Africa.jpg' },
  { name: 'opal.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Opal_from_Yowah%2C_Queensland%2C_Australia_2.jpg/440px-Opal_from_Yowah%2C_Queensland%2C_Australia_2.jpg' },
  { name: 'blue_topaz.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Topaze_bleue_limpide.jpg/440px-Topaze_bleue_limpide.jpg' },
  { name: 'turquoise.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Turquoise_with_quartz.jpg/440px-Turquoise_with_quartz.jpg' },
  { name: 'moonstone.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Moonstone_cabochon.jpg/440px-Moonstone_cabochon.jpg' },
  { name: 'tiger_eye.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Oeil_de_tigre_1.jpg/440px-Oeil_de_tigre_1.jpg' }
];

const destDir = path.join(__dirname, '../client/public/images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  for (const img of images) {
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, path.join(destDir, img.name));
      console.log(`Success: ${img.name}`);
    } catch (err) {
      console.error(`Failed: ${img.name}`, err.message);
    }
  }
}

run();
