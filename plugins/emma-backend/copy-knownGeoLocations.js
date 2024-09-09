const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, 'src/api/knownGeoLocations.json');
const destPath = path.resolve(__dirname, 'dist/knownGeoLocations.json');

fs.copyFile(srcPath, destPath, (err) => {
  if (err) {
    console.error('Error copying file: ', err);
  } else {
    console.log('knownGeoLocations.json copied to dist folder');
  }
});
