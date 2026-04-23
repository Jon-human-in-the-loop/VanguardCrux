const fs = require('fs');
const d3 = require('d3-geo');

// Rounding to 1 decimal place reduces filesize massively
const geoJsonData = JSON.parse(fs.readFileSync('countries.geo.json', 'utf8'));

const projection = d3.geoNaturalEarth1()
  .fitSize([1000, 500], geoJsonData);

const pathGenerator = d3.geoPath().projection(projection);

let svgContent = `<svg id="journey-map-svg" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">\n`;

// Mapping of countries to IDs
const countryIds = {
  'ARG': 'land-argentina',
  'DEU': 'land-germany',
  'ARE': 'land-uae',
  'PRT': 'land-portugal'
};

geoJsonData.features.forEach(feature => {
  if (feature.id === 'ATA') return; 

  const dOriginal = pathGenerator(feature);
  if (!dOriginal) return;

  // Minify path string by rounding coords via regex
  const d = dOriginal.replace(/\d+\.\d+/g, m => parseFloat(m).toFixed(1));

  const countryCode = feature.id;
  let cssClass = 'world-land';
  let idAttr = '';

  if (countryIds[countryCode]) {
    idAttr = ` id="${countryIds[countryCode]}"`;
    cssClass += ` land--${countryIds[countryCode].replace('land-', '')}`;
  }

  svgContent += `  <path class="${cssClass}"${idAttr} d="${d}" />\n`;
});

svgContent += `  <!-- ── FLIGHT TRAIL POLYLINE ── -->\n`;
svgContent += `  <polyline id="journey-trail" points=""/>\n`;
svgContent += `</svg>`;

const outputPath = 'assets/images/world-map-highres.svg';
fs.writeFileSync(outputPath, svgContent);

console.log('✅ Generated ' + outputPath);
console.log('Size:', (fs.statSync(outputPath).size / 1024).toFixed(1), 'KB');
