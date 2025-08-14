/**
 * Generate Placeholder Favicons
 * Creates simple SVG-based favicons as placeholders
 */

const fs = require('fs');
const path = require('path');

// Ensure assets/icons directory exists
const iconsDir = path.join(__dirname, '..', 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG Template for favicon
const svgTemplate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="64" fill="#E6007E"/>
  <text x="256" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="white">E</text>
</svg>`;

// Generate SVG favicon
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), svgTemplate);

// Create a simple text-based .ico file (placeholder)
const icoContent = `/* Placeholder favicon.ico - Replace with actual .ico file */
/* Use an online converter to convert the SVG to proper .ico format */
/* Recommended sizes: 16x16, 32x32, 48x48 */`;

fs.writeFileSync(path.join(iconsDir, 'favicon.ico'), icoContent);

// Generate different sized PNGs placeholders (text files for now)
const sizes = [
    { name: 'icon-72x72.png', size: '72x72' },
    { name: 'icon-96x96.png', size: '96x96' },
    { name: 'icon-128x128.png', size: '128x128' },
    { name: 'icon-144x144.png', size: '144x144' },
    { name: 'icon-152x152.png', size: '152x152' },
    { name: 'icon-192x192.png', size: '192x192' },
    { name: 'icon-384x384.png', size: '384x384' },
    { name: 'icon-512x512.png', size: '512x512' },
    { name: 'apple-touch-icon.png', size: '180x180' }
];

sizes.forEach(({ name, size }) => {
    const content = `/* Placeholder ${name} - Size: ${size} */
/* Convert favicon.svg to PNG at ${size} resolution */
/* Use tools like ImageMagick, online converters, or design software */`;
    
    fs.writeFileSync(path.join(iconsDir, name), content);
});

console.log('✅ Placeholder favicon files created in /assets/icons/');
console.log('⚠️  Note: These are placeholder files. You need to:');
console.log('   1. Convert the SVG to actual image formats');
console.log('   2. Create a proper multi-resolution .ico file');
console.log('   3. Generate PNG files at the specified sizes');
console.log('   4. Consider using a favicon generator service');
