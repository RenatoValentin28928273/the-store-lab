const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const md = require('markdown-it')({ html: true });
const { glob } = require('glob');

// Configurações de Caminho
const TEMPLATE_PATH = path.join(__dirname, '../templates/doc.html');
const CONTENT_DIR = path.join(__dirname, '../content/docs');
const DIST_DIR = path.join(__dirname, '../dist');

async function build() {
  console.log('🚀 Iniciando Build Profissional (Limpez & Preparação)...');
  
  // 1. Limpa e recria a pasta dist
  await fs.emptyDir(DIST_DIR);
  
  // 2. Copia arquivos estáticos da raiz para dist
  const rootFiles = [
    'index.html', 'style.css', 'script.js', 'favicon.png', 'og-image.png', 
    'robots.txt', 'sitemap.xml', 'llms.txt', '404.html',
    'cookies.html', 'privacidade.html', 'termos.html', 'docs.html', 'temas-shopify.html'
  ];

  for (const file of rootFiles) {
    if (await fs.pathExists(path.join(__dirname, '..', file))) {
      await fs.copy(path.join(__dirname, '..', file), path.join(DIST_DIR, file));
    }
  }

  // 3. Copia pastas globais importantes
  const foldersToCopy = ['admin', 'servicos', 'docs/categorias', 'assets'];
  for (const folder of foldersToCopy) {
    if (await fs.pathExists(path.join(__dirname, '..', folder))) {
      await fs.copy(path.join(__dirname, '..', folder), path.join(DIST_DIR, folder));
      console.log(`📁 Copiada: /${folder}`);
    }
  }

  // 4. Carrega o Template das Docs
  if (!await fs.pathExists(TEMPLATE_PATH)) {
    console.error('❌ Erro: Template doc.html não encontrado!');
    process.exit(1);
  }
  const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');

  // 5. Gera os Artigos (Markdown -> HTML)
  const files = await glob(`${CONTENT_DIR}/*.md`);
  await fs.ensureDir(path.join(DIST_DIR, 'docs'));

  for (const file of files) {
    const slug = path.basename(file, '.md');
    const source = await fs.readFile(file, 'utf-8');
    const { data, content } = matter(source);
    
    // Usa o conteúdo diretamente se já for HTML, senão converte com markdown-it
    const isHtml = content.trimStart().startsWith('<');
    const htmlContent = isHtml ? content : md.render(content);
    const toc = [];
    let renderedContent = htmlContent.replace(/<h2(?:[^>]*)>(.*?)<\/h2>/g, (match, title) => {
      const existingId = match.match(/id="([^"]+)"/);
      const id = existingId ? existingId[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc.push({ id, title });
      return `<h2 id="${id}">${title}</h2>`;
    });

    const tocHtml = toc.map((item, index) => 
      `<li class="sidebar-nav-item ${index === 0 ? 'active' : ''}"><a href="#${item.id}">${item.title}</a></li>`
    ).join('\n          ');

    // Injeta variáveis no Template
    let finalHtml = template
      .replace(/{{ TITLE }}/g, data.seo_title || data.title)
      .replace(/{{ TITLE_DISPLAY }}/g, data.title)
      .replace(/{{ DESCRIPTION }}/g, data.description || '')
      .replace(/{{ CONTENT }}/g, renderedContent)
      .replace(/{{ SLUG }}/g, slug)
      .replace(/{{ CATEGORY }}/g, data.category || 'Docs')
      .replace(/{{ COLLECTION_ID }}/g, (data.category || 'docs').toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))
      .replace(/{{ SIDEBAR_LINKS }}/g, tocHtml)
      .replace(/{{ OG_IMAGE }}/g, data.og_image || 'https://thestorelab.com.br/og-image.png')
      .replace(/{{ CTA_TITLE }}/g, data.cta_title || 'Quer impulsionar seu e-commerce?')
      .replace(/{{ CTA_DESCRIPTION }}/g, data.cta_desc || 'A The Lab Store projeta e otimiza lojas Shopify de alto nível visando conversão máxima.')
      .replace(/{{ CTA_BUTTON }}/g, data.cta_btn || 'Falar com Especialista');

    const outputPath = path.join(DIST_DIR, 'docs', `${slug}.html`);
    await fs.writeFile(outputPath, finalHtml);
    
    console.log(`✅ Gerado: /docs/${slug}.html`);
  }

  console.log('✨ Build Profissional concluído em /dist!');
}

build().catch(err => {
  console.error('❌ Erro no Build:', err);
  process.exit(1);
});
