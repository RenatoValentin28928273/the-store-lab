import fs from 'node:fs';

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const styleMatch = html.match(/\n  <style>\n([\s\S]*?)\n  <\/style>/);
if (!styleMatch) {
  throw new Error('Inline style block not found.');
}

fs.writeFileSync('themes.css', styleMatch[1].replace(/^    /gm, ''), 'utf8');
html = html.replace(styleMatch[0], '\n  <link rel="stylesheet" href="/themes.css" />');

const inlineScripts = [...html.matchAll(/\n  <script>\n([\s\S]*?)\n  <\/script>/g)];
const finalScript = inlineScripts[inlineScripts.length - 1];
if (!finalScript) {
  throw new Error('Final inline script block not found.');
}

fs.writeFileSync('app.js', finalScript[1].replace(/^    /gm, ''), 'utf8');
html = html.replace(finalScript[0], '\n  <script src="/app.js" defer></script>');

fs.writeFileSync(htmlPath, html, 'utf8');
