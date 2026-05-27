import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const copyFile = async (from, to) => {
  await fs.mkdir(path.dirname(path.join(dist, to)), { recursive: true });
  await fs.copyFile(path.join(root, from), path.join(dist, to));
};

const writeText = async (to, content) => {
  await fs.mkdir(path.dirname(path.join(dist, to)), { recursive: true });
  await fs.writeFile(path.join(dist, to), content, 'utf8');
};

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

await copyFile('index.html', 'index.html');
await copyFile('comprar-tema-shopify/index.html', 'comprar-tema-shopify/index.html');

await Promise.all([
  copyFile('app.js', 'app.js'),
  copyFile('base.css', 'base.css'),
  copyFile('themes.css', 'themes.css'),
  copyFile('home-reference.css', 'home-reference.css'),
  copyFile('services.css', 'services.css'),
  copyFile('favicon.png', 'favicon.png'),
  copyFile('og-image.png', 'og-image.png'),
]);

await writeText('robots.txt', `User-agent: *
Allow: /

Sitemap: https://www.thestorelab.com.br/sitemap.xml
`);

await writeText('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.thestorelab.com.br/</loc>
    <lastmod>2026-05-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.thestorelab.com.br/comprar-tema-shopify/</loc>
    <lastmod>2026-05-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`);

console.log('Public build generated with home and comprar-tema-shopify only.');
