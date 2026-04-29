import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const baseUrl = 'https://thestorelab.com.br';
const postsPath = path.join(root, 'content', 'posts.json');

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const slugify = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatDate = (value) => {
  const [year, month, day] = String(value || '').split('-');
  if (!year || !month || !day) return 'Sem data';
  return `${day}/${month}/${year}`;
};

const whatsappHref = (text) =>
  `https://wa.me/5542999655157?text=${encodeURIComponent(text || 'Ola! Quero falar com a The Store Lab.')}`;

const commonHead = ({ title, description, canonical, type = 'website' }) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/favicon.png" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${baseUrl}/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${canonical}" />
  <meta property="twitter:title" content="${escapeHtml(title)}" />
  <meta property="twitter:description" content="${escapeHtml(description)}" />
  <meta property="twitter:image" content="${baseUrl}/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/base.css" />
  <link rel="stylesheet" href="/themes.css" />
  <link rel="stylesheet" href="/home-reference.css" />
  <link rel="stylesheet" href="/blog.css" />
  <link rel="stylesheet" href="/article.css" />`;

const header = () => `
</head>
<body class="home-reference blog-article-page">
  <a class="skip-link" href="#main">Pular para o conteudo principal</a>
  <header class="navbar" id="navbar">
    <div class="container nav-inner">
      <a href="/" class="logo" title="The Store Lab">
        <div class="logo-box">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20" role="img" aria-label="Logo The Store Lab">
            <path d="M15 9V4H16C16.6 4 17 3.6 17 3C17 2.4 16.6 2 16 2H8C7.4 2 7 2.4 7 3C7 3.6 7.4 4 8 4H9V9L4.5 18.5C4.2 19.2 4.7 20 5.5 20H18.5C19.3 20 19.8 19.2 19.5 18.5L15 9Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.3 16C8.5 15 10.5 17 13 16C15.5 15 17.5 16.5 17.7 17L18.5 18.5C18.7 19 18.3 19.5 17.8 19.5L6.2 19.5C5.7 19.5 5.3 19 5.5 18.5L6.3 16Z" fill="currentColor"/>
          </svg>
        </div>
        <span class="logo-text">THE STORE <span class="logo-accent">LAB</span></span>
      </a>
      <nav class="nav-links" aria-label="Navegacao principal">
        <a href="/">Inicio</a>
        <a href="/#processo">Como funciona</a>
        <a href="/#portfolio">Projetos</a>
        <a href="/blog/" aria-current="page">Blog</a>
        <a href="/#about">Contato</a>
      </nav>
      <div class="nav-meta-links">
        <a href="https://www.youtube.com" target="_blank" rel="noopener">YouTube</a>
        <a href="https://www.linkedin.com/company/thestorelab/" target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <a href="${whatsappHref('Ola! Quero falar sobre desenvolvimento Shopify com a The Store Lab.')}" class="nav-cta">Falar agora</a>
      <button class="hamburger" id="hamburger" aria-label="Menu" aria-controls="mobile-menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav class="mobile-nav">
      <a href="/" class="mobile-link">Inicio</a>
      <a href="/#processo" class="mobile-link">Como funciona</a>
      <a href="/#portfolio" class="mobile-link">Projetos</a>
      <a href="/blog/" class="mobile-link" aria-current="page">Blog</a>
      <a href="/#about" class="mobile-link">Contato</a>
      <a href="https://www.linkedin.com/company/thestorelab/" target="_blank" rel="noopener" class="mobile-link">LinkedIn</a>
      <a href="${whatsappHref('Ola! Quero falar sobre desenvolvimento Shopify com a The Store Lab.')}" class="mobile-link mobile-btn">Falar agora</a>
    </nav>
  </div>`;

const footer = () => `
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-bottom">
        <p>&copy; 2026 The Store Lab</p>
        <div class="footer-bottom-links">
          <a href="/blog/" aria-current="page">Blog</a>
          <a href="/#about">Contato</a>
          <a href="https://wa.me/5542999655157" target="_blank" rel="noopener">Trabalhe conosco</a>
        </div>
      </div>
    </div>
  </footer>
  <script src="/app.js" defer></script>
</body>
</html>`;

const schemaForPost = (post) => {
  const url = `${baseUrl}/blog/${post.slug}/`;
  const extraStructuredData = Array.isArray(post.structuredData)
    ? post.structuredData
    : post.structuredData
      ? [post.structuredData]
      : [];
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'The Store Lab',
      url: `${baseUrl}/`,
      logo: `${baseUrl}/favicon.png`,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      image: `${baseUrl}/og-image.png`,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'The Store Lab' },
      publisher: { '@id': `${baseUrl}/#organization` },
      mainEntityOfPage: url,
    },
    ...extraStructuredData,
  ];

  return `<script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }, null, 2)}
  </script>`;
};

const renderPost = (post, relatedPosts) => {
  const canonical = `${baseUrl}/blog/${post.slug}/`;
  const toc = post.sections
    .map((section) => `<a href="#${slugify(section.heading)}">${escapeHtml(section.heading)}</a>`)
    .join('\n');
  const sections = post.sections
    .map(
      (section, index) => `<section id="${slugify(section.heading)}">
            <h2>${index + 1}. ${escapeHtml(section.heading)}</h2>
            <p>${escapeHtml(section.body)}</p>
          </section>`
    )
    .join('\n');
  const related = relatedPosts
    .slice(0, 2)
    .map((item) => `<a href="/blog/${item.slug}/">${escapeHtml(item.title)}</a>`)
    .join('\n');

  return `${commonHead({
    title: `${post.title} | The Store Lab`,
    description: post.description,
    canonical,
    type: 'article',
  })}
  ${schemaForPost(post)}
${header()}
  <main id="main" class="article-shell">
    <section class="article-hero">
      <div class="article-wrap">
        <nav class="article-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Inicio</a><span>/</span><a href="/blog/">Blog</a><span>/</span><span>${escapeHtml(post.category)}</span>
        </nav>
        <div class="article-hero__grid">
          <div>
            <span class="article-kicker">${escapeHtml(post.category)}</span>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="article-dek">${escapeHtml(post.excerpt)}</p>
            <div class="article-meta">
              <span>${formatDate(post.date)}</span>
              <span>${escapeHtml(post.readTime)}</span>
              <span>${escapeHtml(post.category)}</span>
            </div>
          </div>
          <aside class="article-summary">
            <span class="article-chip">Resumo</span>
            <p>${escapeHtml(post.summary)}</p>
          </aside>
        </div>
      </div>
    </section>
    <section class="article-main">
      <div class="article-wrap article-layout">
        <article class="article-content">
          ${sections}
        </article>
        <aside class="article-aside">
          <div class="article-toc">
            <span class="article-toc__eyebrow">Neste artigo</span>
            <nav aria-label="Indice do artigo">${toc}</nav>
          </div>
          <div class="article-cta-box">
            <span class="article-cta__eyebrow">Implementacao</span>
            <p>A The Store Lab pode transformar essa leitura em ajustes reais na sua loja Shopify.</p>
            <a class="article-cta-link" href="${whatsappHref(post.whatsappText)}" target="_blank" rel="noopener">${escapeHtml(post.cta || 'Falar agora')}</a>
          </div>
          <div class="article-related">
            <span class="article-toc__eyebrow">Leia depois</span>
            <nav>${related}</nav>
          </div>
        </aside>
      </div>
    </section>
    <section class="article-footer-cta" id="about">
      <div class="article-wrap">
        <div class="cta-shell">
          <span class="cta-eyebrow">Proximo passo</span>
          <h2>Quer evoluir sua loja Shopify com mais criterio?</h2>
          <p>A The Store Lab pode revisar tema, performance, SEO tecnico e experiencia de compra com foco em resultado real.</p>
          <div class="cta-links">
            <a href="mailto:contato@thestorelab.com.br">E-mail</a>
            <a href="https://www.linkedin.com/company/thestorelab/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://wa.me/5542999655157" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  </main>
${footer()}`;
};

const renderBlogIndex = (posts) => {
  const cards = posts
    .map(
      (post) => `<article class="post-card">
            <p class="post-category">${escapeHtml(post.category)}</p>
            <h3><a class="post-title-link" href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h3>
            <p>${escapeHtml(post.excerpt)}</p>
            <a href="/blog/${post.slug}/">Ler artigo</a>
          </article>`
    )
    .join('\n');
  const featured = posts[0];
  const featuredMarkup = featured
    ? `<section class="blog-featured" aria-labelledby="featured-title">
      <div class="container">
        <div class="section-heading blog-section-heading">
          <div><span class="section-kicker">Conteudo principal</span><h2 id="featured-title">Comece por aqui</h2></div>
          <p>Uma base editorial pensada para responder duvidas de alto valor antes da conversa comercial.</p>
        </div>
        <article class="featured-post">
          <div class="featured-post__meta"><span>${escapeHtml(featured.category)}</span><time datetime="${featured.date}">${formatDate(featured.date)}</time></div>
          <div class="featured-post__body">
            <p class="post-category">Shopify</p>
            <h3><a class="post-title-link post-title-link--featured" href="/blog/${featured.slug}/">${escapeHtml(featured.title)}</a></h3>
            <p>${escapeHtml(featured.excerpt)}</p>
            <a class="post-readmore post-readmore--featured" href="/blog/${featured.slug}/">Ler artigo completo</a>
          </div>
        </article>
      </div>
    </section>`
    : '';
  const indexMarkup = posts.length
    ? `<div class="post-grid">${cards}</div>`
    : `<div class="empty-blog-state">
          <span class="section-kicker">Sem posts publicados</span>
          <h2>Vamos comecar do zero</h2>
          <p>Os artigos cadastrados no admin vao aparecer aqui automaticamente depois do proximo build.</p>
        </div>`;

  return `${commonHead({
    title: 'Blog The Store Lab | Shopify, performance e conversao',
    description: 'Guias praticos sobre desenvolvimento Shopify, arquitetura de temas, SEO tecnico, performance e experiencia de compra para e-commerces.',
    canonical: `${baseUrl}/blog/`,
  })}
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${baseUrl}/#organization`, name: 'The Store Lab', url: `${baseUrl}/`, logo: `${baseUrl}/favicon.png` },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/blog/#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog/` },
        ],
      },
      {
        '@type': 'Blog',
        '@id': `${baseUrl}/blog/#blog`,
        name: 'Blog The Store Lab',
        description: 'Guias praticos sobre desenvolvimento Shopify, SEO tecnico, performance e conversao.',
        url: `${baseUrl}/blog/`,
        publisher: { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/blog/#posts`,
        name: 'Guias de Shopify e e-commerce',
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/blog/${post.slug}/`,
          name: post.title,
        })),
      },
    ],
  }, null, 2)}
  </script>
${header().replace('blog-article-page', 'blog-page')}
  <main id="main">
    <section class="blog-hero">
      <div class="container blog-hero__grid">
        <div class="blog-hero__copy" data-reveal>
          <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><span>Blog</span></nav>
          <p class="blog-eyebrow">Shopify, SEO e conversao</p>
          <h1>Blog The Store Lab</h1>
          <p class="blog-lead">Guias tecnicos e praticos para transformar lojas Shopify em operacoes mais rapidas, claras e preparadas para vender.</p>
        </div>
        <aside class="blog-hero__panel" aria-label="Arquitetura editorial do blog" data-reveal>
          <span class="panel-label">Arquitetura</span>
          <dl>
            <div><dt>Guias</dt><dd>Conteudos evergreen para busca organica.</dd></div>
            <div><dt>Checklists</dt><dd>Listas acionaveis para auditoria e publicacao.</dd></div>
            <div><dt>Casos</dt><dd>Leituras de UX, performance e evolucao tecnica.</dd></div>
          </dl>
        </aside>
      </div>
    </section>
    ${featuredMarkup}
    <section class="blog-index" aria-labelledby="posts-title">
      <div class="container">
        <div class="section-heading blog-section-heading">
          <div><span class="section-kicker">Guias recentes</span><h2 id="posts-title">Biblioteca editorial</h2></div>
          <p>Todos os artigos vivem em URLs proprias seguindo a estrutura /blog/slug-do-artigo/.</p>
        </div>
        ${indexMarkup}
      </div>
    </section>
    <section class="reference-cta blog-cta" id="about">
      <div class="container">
        <div class="cta-shell">
          <span class="cta-eyebrow">Proximo passo</span>
          <h2>Quer transformar uma pauta em melhoria real?</h2>
          <p>Podemos revisar sua loja Shopify, priorizar os ajustes e implementar com foco em performance, clareza e conversao.</p>
          <div class="cta-links">
            <a href="mailto:contato@thestorelab.com.br">E-mail</a>
            <a href="https://www.linkedin.com/company/thestorelab/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://wa.me/5542999655157" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  </main>
${footer()}`;
};

const renderSitemap = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${posts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}/</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const posts = JSON.parse(await fs.readFile(postsPath, 'utf8')).map((post) => ({
  ...post,
  slug: slugify(post.slug || post.title),
}));

await fs.mkdir(path.join(root, 'blog'), { recursive: true });
const postSlugs = new Set(posts.map((post) => post.slug));
const blogEntries = await fs.readdir(path.join(root, 'blog'), { withFileTypes: true });
await Promise.all(
  blogEntries
    .filter((entry) => entry.isDirectory() && !postSlugs.has(entry.name))
    .map((entry) => fs.rm(path.join(root, 'blog', entry.name), { recursive: true, force: true }))
);
await fs.writeFile(path.join(root, 'blog', 'index.html'), renderBlogIndex(posts), 'utf8');
await fs.writeFile(path.join(root, 'sitemap.xml'), renderSitemap(posts), 'utf8');

for (const post of posts) {
  const postDir = path.join(root, 'blog', post.slug);
  await fs.mkdir(postDir, { recursive: true });
  await fs.writeFile(
    path.join(postDir, 'index.html'),
    renderPost(post, posts.filter((item) => item.slug !== post.slug)),
    'utf8'
  );
}

console.log(`Generated ${posts.length} blog posts.`);
