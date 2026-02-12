import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path based on script location. Assuming this script is in project root.
const distPath = path.resolve(__dirname, 'dist');
const indexHtml = path.join(distPath, 'index.html');
const notFoundHtml = path.join(distPath, '404.html');

try {
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, notFoundHtml);
    console.log('✅ Copied index.html to 404.html for GitHub Pages SPA support.');
  } else {
    console.warn('⚠️ index.html not found in dist/ folder. Skipping 404.html creation.');
    // Don't fail the build, just warn
  }
} catch (error) {
  console.error('❌ Error creating 404.html:', error);
  process.exit(1);
}
