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
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatDate = (value) => {
  const [year, month, day] = String(value || '').split('-');
  if (!year || !month || !day) return 'Sem data';
  return `${day}/${month}/${year}`;
};

const readingTime = (post) => {
  const text = [post.excerpt || '', post.summary || '', ...(post.sections || []).map(s => (s.heading || '') + ' ' + (s.body || ''))].join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de leitura`;
};

const renderCard = (post) => `<article class="post-card">
  <span class="post-card__tag">${escapeHtml(post.category)}</span>
  <h3 class="post-card__title"><a class="post-title-link" href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h3>
  <p class="post-card__excerpt">${escapeHtml(post.excerpt)}</p>
  <p class="post-card__meta">${formatDate(post.date)} · ${readingTime(post)}</p>
</article>`;

const whatsappHref = (text) =>
  `https://wa.me/5542999655157?text=${encodeURIComponent(text || 'Ola! Quero falar com a The Store Lab.')}`;

const categoryCatalog = [
  { name: 'Guias', slug: 'guias', description: 'Conteudos evergreen para busca organica.' },
  { name: 'Checklists', slug: 'checklists', description: 'Listas acionaveis para auditoria e publicacao.' },
  { name: 'Casos', slug: 'casos', description: 'Leituras de UX, performance e evolucao tecnica.' },
];

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
<body class="home-reference post-page">
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
        <a href="/#sistema">Sistema</a>
        <a href="/#servicos">Servicos</a>
        <a href="/#processo">Como funciona</a>
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
      <a href="/#sistema" class="mobile-link">Sistema</a>
      <a href="/#servicos" class="mobile-link">Servicos</a>
      <a href="/#processo" class="mobile-link">Como funciona</a>
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
          <a href="/servicos/google-merchant-center-next/">Servicos</a>
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
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);
  const category = escapeHtml(post.category);
  const toc = post.sections
    .map(
      (section, index) =>
        `<li><a href="#${slugify(section.heading)}">${escapeHtml(section.heading)}</a></li>`
    )
    .join('\n');
  const sections = post.sections
    .map((section, index) => {
      const inlineCta =
        index === 1
          ? `<a class="post-inline-cta" href="${whatsappHref(post.whatsappText)}" target="_blank" rel="noopener">${escapeHtml(post.cta || 'Falar agora')}</a>`
          : '';
      return `<section class="article-section" id="${slugify(section.heading)}">
            <h2>${escapeHtml(section.heading)}</h2>
            <p>${escapeHtml(section.body)}</p>${inlineCta}
          </section>`;
    })
    .join('\n');
  const related = relatedPosts.slice(0, 3).map(item => `<a class="post-related__link" href="/blog/${item.slug}/">${escapeHtml(item.title)}</a>`).join('\n');
  const relatedBlock = related ? `<div class="post-related"><p class="post-related__label">Leia depois</p><div class="post-related__links">${related}</div></div>` : '';

  return `${commonHead({
    title: `${post.title} | The Store Lab`,
    description: post.description,
    canonical,
    type: 'article',
  })}
  ${schemaForPost(post)}
${header()}
  <main id="main" class="post-shell">
    <header class="post-hero">
      <div class="post-wrap">
        <nav class="post-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span>${category}</span>
        </nav>
        <p class="post-eyebrow">${category}</p>
        <h1>${title}</h1>
        <p class="post-lead">${excerpt}</p>
        <div class="post-meta">
          <span>The Store Lab</span>
          <span>${formatDate(post.date)} · ${readingTime(post)}</span>
        </div>
      </div>
    </header>
    <div class="post-body">
      <div class="post-wrap">
        <details class="post-toc" open>
          <summary class="post-toc__header">
            <span>Neste artigo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </summary>
          <nav class="post-toc__nav" aria-label="Sumario"><ol class="post-toc__list">${toc}</ol></nav>
        </details>
        <article class="post-content">
          ${sections}
          <a class="post-primary-cta" href="${whatsappHref(post.whatsappText)}" target="_blank" rel="noopener">${escapeHtml(post.cta || 'Falar com a The Store Lab')}</a>
        </article>
        ${relatedBlock}
      </div>
    </div>
    <section class="post-footer-cta" id="about">
      <div class="post-wrap">
        <div class="cta-shell">
          <p class="cta-eyebrow">Proximo passo</p>
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

const getCategories = (posts) => {
  const categories = new Map();
  for (const categoryInfo of categoryCatalog) {
    categories.set(categoryInfo.name, { ...categoryInfo, posts: [] });
  }

  for (const post of posts) {
    const categoryName = String(post.category || 'Sem categoria').trim();
    const categorySlug = slugify(categoryName);
    if (!categories.has(categoryName)) {
      categories.set(categoryName, { name: categoryName, slug: categorySlug, description: '', posts: [] });
    }
    categories.get(categoryName).posts.push(post);
  }

  return [...categories.values()];
};

const renderTopicLinks = (categories) =>
  categories
    .map((category) => `<a href="/blog/${category.slug}/">${escapeHtml(category.name)}</a>`)
    .join('\n');

const renderCategoriesIndex = (categories) => {
  const canonical = `${baseUrl}/blog/categoria/`;
  const categoryCards = categories
    .map(
      (category) => {
        const posts = category.posts;
        return `<article class="category-card">
          <span class="post-card__tag">${escapeHtml(category.name)}</span>
          <h3><a class="post-title-link" href="/blog/categoria/${category.slug}/">${escapeHtml(category.name)}</a></h3>
          <p>${escapeHtml(category.description || `Artigos sobre ${category.name}.`)}</p>
          <div class="category-card__meta">
            <span>${posts.length} artigo${posts.length === 1 ? '' : 's'}</span>
            <a href="/blog/categoria/${category.slug}/">Ver categoria</a>
          </div>
        </article>`;
      }
    )
    .join('\n');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'The Store Lab',
        url: `${baseUrl}/`,
        logo: `${baseUrl}/favicon.png`,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog/` },
          { '@type': 'ListItem', position: 3, name: 'Categorias', item: canonical },
        ],
      },
    ],
  };

  return `${commonHead({
    title: 'Categorias do Blog The Store Lab',
    description: 'Conheça as categorias do blog The Store Lab e encontre artigos por tema.',
    canonical,
  })}
  <script type="application/ld+json">
  ${JSON.stringify(structuredData, null, 2)}
  </script>
${header().replace('post-page', 'blog-page')}
  <main id="main">
    <section class="blog-hero">
      <div class="container">
        <nav class="blog-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span>Categorias</span>
        </nav>
        <p class="blog-eyebrow">Categorias do blog</p>
        <h1>Categorias</h1>
        <p class="blog-lead">Veja os temas do blog The Store Lab e acesse artigos selecionados por categoria.</p>
      </div>
    </section>
    <section class="blog-section">
      <div class="container">
        <div class="blog-section__header">
          <h2 class="blog-section__title">Todos os temas</h2>
        </div>
        <div class="post-grid">
          ${categoryCards}
        </div>
      </div>
    </section>
  </main>
${footer()}`;
};

const renderCategoryPage = (category, posts) => {
  const canonical = `${baseUrl}/blog/${category.slug}/`;
  const cards = posts.map(post => renderCard(post)).join('\n');
  const postsMarkup = posts.length
    ? `<div class="post-grid">${cards}</div>`
    : `<div class="empty-blog-state">
          <span class="section-kicker">Nenhum artigo encontrado</span>
          <h2>Procure outra categoria</h2>
          <p>Não há artigos publicados nesta categoria no momento.</p>
        </div>`;

  return `${commonHead({
    title: `${category.name} | Blog The Store Lab`,
    description: `Artigos sobre ${category.name} no blog The Store Lab.`,
    canonical,
  })}
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${baseUrl}/#organization`, name: 'The Store Lab', url: `${baseUrl}/`, logo: `${baseUrl}/favicon.png` },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog/` },
          { '@type': 'ListItem', position: 3, name: category.name, item: canonical },
        ],
      },
    ],
  }, null, 2)}
  </script>
${header().replace('post-page', 'blog-page')}
  <main id="main">
    <section class="blog-hero">
      <div class="container">
        <nav class="blog-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Inicio</a><span>/</span><a href="/blog/">Blog</a><span>/</span><span>${escapeHtml(category.name)}</span>
        </nav>
        <p class="blog-eyebrow">Categoria do blog</p>
        <h1>${escapeHtml(category.name)}</h1>
        <p class="blog-lead">Artigos sobre ${escapeHtml(category.name)} para ajudar sua loja Shopify a crescer.</p>
      </div>
    </section>
    <section class="blog-section">
      <div class="container">
        <div class="blog-section__header">
          <h2 class="blog-section__title">Artigos desta categoria</h2>
        </div>
        ${postsMarkup}
      </div>
    </section>
  </main>
${footer()}`;
};

const renderBlogIndex = (posts) => {
  const categories = getCategories(posts);
  const topicLinks = renderTopicLinks(categories);
  const cards = posts.map(post => renderCard(post)).join('\n');
  const featured = posts[0];
  const featuredMarkup = featured
    ? `<section class="blog-section">
      <div class="container">
        <div class="blog-section__header">
          <h2 class="blog-section__title">Artigo em destaque</h2>
        </div>
        <article class="post-card post-card--hero">
          <span class="post-card__tag">${escapeHtml(featured.category)}</span>
          <h3 class="post-card__title"><a class="post-title-link" href="/blog/${featured.slug}/">${escapeHtml(featured.title)}</a></h3>
          <p class="post-card__excerpt">${escapeHtml(featured.excerpt)}</p>
          <p class="post-card__meta">${formatDate(featured.date)} · ${readingTime(featured)}</p>
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
${header().replace('post-page', 'blog-page')}
  <main id="main">
    <section class="blog-hero">
      <div class="container">
        <nav class="blog-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Inicio</a><span aria-hidden="true">/</span><span>Blog</span>
        </nav>
        <p class="blog-eyebrow">Shopify, SEO e conversao</p>
        <h1>Blog The Store Lab</h1>
        <p class="blog-lead">Guias tecnicos e praticos para transformar lojas Shopify em operacoes mais rapidas, claras e preparadas para vender.</p>
        <div class="blog-topics">${topicLinks}</div>
      </div>
    </section>
    ${featuredMarkup}
    <section class="blog-section">
      <div class="container">
        <div class="blog-section__header">
          <h2 class="blog-section__title">Todos os artigos</h2>
          <a class="blog-section__pill" href="/blog/categoria/">Ver categorias</a>
        </div>
        ${indexMarkup}
      </div>
    </section>
    <section class="blog-section blog-cta" id="about">
      <div class="container">
        <div class="cta-shell">
          <p class="cta-eyebrow">Proximo passo</p>
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

const renderSitemap = (posts) => {
  const categories = getCategories(posts);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/servicos/google-merchant-center-next/</loc>
    <lastmod>2026-05-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/categoria/</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
${categories
    .map(
      (category) => {
        const lastmod = posts
          .filter((post) => slugify(post.category || '') === category.slug)
          .map((post) => post.date)
          .sort()
          .reverse()[0] || '2026-04-28';
        return `  <url>
    <loc>${baseUrl}/blog/${category.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    )
    .join('\n')}
</urlset>
`;
};

const posts = JSON.parse(await fs.readFile(postsPath, 'utf8')).map((post) => ({
  ...post,
  slug: slugify(post.slug || post.title),
}));

await fs.mkdir(path.join(root, 'blog'), { recursive: true });
const categories = getCategories(posts);
const postSlugs = new Set(posts.map((post) => post.slug));
const categorySlugs = new Set(categories.map((category) => category.slug));
const blogEntries = await fs.readdir(path.join(root, 'blog'), { withFileTypes: true });
await Promise.all(
  blogEntries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name !== 'categoria' &&
        !postSlugs.has(entry.name) &&
        !categorySlugs.has(entry.name)
    )
    .map((entry) => fs.rm(path.join(root, 'blog', entry.name), { recursive: true, force: true }))
);
const categoryDir = path.join(root, 'blog', 'categoria');
await fs.mkdir(categoryDir, { recursive: true });
const categoryEntries = await fs.readdir(categoryDir, { withFileTypes: true });
await Promise.all(
  categoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => fs.rm(path.join(categoryDir, entry.name), { recursive: true, force: true }))
);
await fs.writeFile(path.join(root, 'blog', 'index.html'), renderBlogIndex(posts), 'utf8');
await fs.writeFile(path.join(root, 'blog', 'categoria', 'index.html'), renderCategoriesIndex(categories), 'utf8');
await fs.writeFile(path.join(root, 'sitemap.xml'), renderSitemap(posts), 'utf8');

for (const category of categories) {
  const categoryPath = path.join(root, 'blog', category.slug);
  await fs.mkdir(categoryPath, { recursive: true });
  await fs.writeFile(path.join(categoryPath, 'index.html'), renderCategoryPage(category, category.posts), 'utf8');
}

for (const post of posts) {
  const postDir = path.join(root, 'blog', post.slug);
  await fs.mkdir(postDir, { recursive: true });
  await fs.writeFile(
    path.join(postDir, 'index.html'),
    renderPost(post, posts.filter((item) => item.slug !== post.slug)),
    'utf8'
  );
}

console.log(`Generated ${posts.length} blog posts and ${categories.length} category pages.`);
