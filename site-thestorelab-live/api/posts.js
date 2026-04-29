import fs from 'node:fs/promises';
import path from 'node:path';

const postsPath = path.join(process.cwd(), 'content', 'posts.json');

const isAuthorized = (request) => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return String(request.headers['x-admin-password'] || '').trim() === String(configured).trim();
};

export default async function handler(request, response) {
  if (!isAuthorized(request)) {
    response.status(401).json({ error: 'Senha invalida ou ADMIN_PASSWORD ausente no Vercel.' });
    return;
  }

  const posts = JSON.parse(await fs.readFile(postsPath, 'utf8'));
  response.status(200).json({ posts });
}
