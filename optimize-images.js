const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'images');

fs.readdir(dir, (err, files) => {
  if (err) throw err;
  
  files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const filePath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      sharp(filePath)
        .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920px
        .jpeg({ quality: 80, progressive: true })
        .toFile(tempPath)
        .then(() => {
          fs.renameSync(tempPath, filePath);
          console.log(`Resized and optimized: ${file}`);
        })
        .catch(err => {
          console.error(`Error processing ${file}:`, err);
        });
    }
  });
});
