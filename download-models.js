const fs = require('fs');
const path = require('path');
const https = require('https');

// Create assets and models directories if they don't exist
const modelsDir = path.join(__dirname, 'assets', 'models');
if (!fs.existsSync(path.join(__dirname, 'assets'))) {
  fs.mkdirSync(path.join(__dirname, 'assets'));
}
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

// Model URLs (these are placeholders, replace with actual model URLs)
const models = [
  {
    name: 'shirt_baked.glb',
    url: 'https://raw.githubusercontent.com/Starklord17/threejs-t-shirt/main/public/shirt_baked.glb'
  },
  {
    name: 'placeholder.jpg',
    url: 'https://via.placeholder.com/400x400?text=Upload+Image',
    outputPath: path.join(__dirname, 'assets', 'placeholder.jpg')
  }
];

// Download each model
models.forEach(model => {
  const outputPath = model.outputPath || path.join(modelsDir, model.name);
  console.log(`Downloading ${model.name}...`);
  
  const file = fs.createWriteStream(outputPath);
  https.get(model.url, response => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${model.name}`);
    });
  }).on('error', err => {
    file.close();
    fs.unlink(outputPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Error removing incomplete file ${model.name}: ${unlinkErr.message}`);
      }
      console.error(`Error downloading ${model.name}: ${err.message}`);
    });
  });
}); 