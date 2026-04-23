const fs = require('fs');
const svg = fs.readFileSync('assets/images/world-map-highres.svg', 'utf8');
const jsCode = `const WORLD_MAP_SVG = \`${svg.replace(/`/g, '\\`')}\`;\n`;
fs.writeFileSync('assets/js/map-data.js', jsCode);
console.log('Done!');
