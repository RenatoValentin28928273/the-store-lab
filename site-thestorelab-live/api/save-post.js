const contentPath = 'site-thestorelab-live/content/posts.json';

const slugify = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const readJsonBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
};

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Variavel ${name} nao configurada no Vercel.`);
  return value;
};

const githubRequest = async (url, options = {}) => {
  const token = requireEnv('GITHUB_TOKEN');
  const response = await fetch(url, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'x-github-api-version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `GitHub API falhou com status ${response.status}.`);
  }
  return payload;
};

const getRepoConfig = () => ({
  owner: String(process.env.GITHUB_OWNER || 'RenatoValentin28928273').trim(),
  repo: String(process.env.GITHUB_REPO || 'the-store-lab').trim(),
  branch: String(process.env.GITHUB_BRANCH || 'noir-v3').trim(),
});

const isAuthorized = (request) => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return String(request.headers['x-admin-password'] || '').trim() === String(configured).trim();
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Metodo nao permitido.' });
    return;
  }

  if (!isAuthorized(request)) {
    response.status(401).json({ error: 'Senha invalida ou ADMIN_PASSWORD ausente no Vercel.' });
    return;
  }

  try {
    const { post } = await readJsonBody(request);
    if (!post?.title) throw new Error('Titulo e obrigatorio.');
    if (!Array.isArray(post.sections) || !post.sections.length) {
      throw new Error('O post precisa ter pelo menos uma secao.');
    }

    const cleanPost = {
      ...post,
      slug: slugify(post.slug || post.title),
      structuredData: Array.isArray(post.structuredData) ? post.structuredData : [],
      sections: post.sections.map((section) => ({
        heading: String(section.heading || '').trim(),
        body: String(section.body || '').trim(),
      })),
    };

    const { owner, repo, branch } = getRepoConfig();
    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}?ref=${branch}`;
    const current = await githubRequest(fileUrl);
    const currentContent = Buffer.from(current.content || '', 'base64').toString('utf8');
    const posts = JSON.parse(currentContent);
    const nextPosts = posts.filter((item) => item.slug !== cleanPost.slug);
    nextPosts.unshift(cleanPost);

    await githubRequest(`https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Update blog post: ${cleanPost.title}`,
        content: Buffer.from(`${JSON.stringify(nextPosts, null, 2)}\n`).toString('base64'),
        sha: current.sha,
        branch,
      }),
    });

    let deployTriggered = false;
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
      deployTriggered = true;
    }

    response.status(200).json({ posts: nextPosts, deployTriggered });
  } catch (error) {
    response.status(500).json({ error: error.message || 'Nao foi possivel salvar o post.' });
  }
}
