const loginPanel = document.getElementById('loginPanel');
const workspace = document.getElementById('workspace');
const passwordInput = document.getElementById('adminPassword');
const loginButton = document.getElementById('loginButton');
const postList = document.getElementById('postList');
const contentGrid = document.getElementById('contentGrid');
const contentCount = document.getElementById('contentCount');
const postForm = document.getElementById('postForm');
const newPostButton = document.getElementById('newPostButton');
const statusMessage = document.getElementById('statusMessage');

let posts = [];
let selectedSlug = '';

const slugify = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sectionsToText = (sections = []) =>
  sections.map((section) => `## ${section.heading}\n${section.body}`).join('\n\n');

const textToSections = (value = '') =>
  value
    .split(/\n##\s+/)
    .map((block) => block.replace(/^##\s+/, '').trim())
    .filter(Boolean)
    .map((block) => {
      const [heading, ...body] = block.split('\n');
      return {
        heading: heading.trim(),
        body: body.join('\n').trim(),
      };
    })
    .filter((section) => section.heading && section.body);

const parseStructuredData = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return [];
  const parsed = JSON.parse(trimmed);
  return Array.isArray(parsed) ? parsed : [parsed];
};

const structuredDataToText = (value) => {
  if (!value) return '';
  const items = Array.isArray(value) ? value : [value];
  return JSON.stringify(items.length === 1 ? items[0] : items, null, 2);
};

const getPassword = () => sessionStorage.getItem('tsl_admin_password') || '';

const setStatus = (message) => {
  statusMessage.textContent = message;
};

const formatDate = (value = '') => {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return 'Sem data';
  return `${day}/${month}/${year}`;
};

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const renderList = () => {
  postList.innerHTML = posts
    .map(
      (post) =>
        `<button class="post-item${post.slug === selectedSlug ? ' active' : ''}" type="button" data-slug="${post.slug}">${post.title}</button>`
    )
    .join('');
};

const renderContentOverview = () => {
  contentCount.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
  contentGrid.innerHTML = posts
    .map((post) => {
      const schemaCount = Array.isArray(post.structuredData) ? post.structuredData.length : 0;
      const sectionsCount = Array.isArray(post.sections) ? post.sections.length : 0;
      return `<article class="content-card">
          <div class="content-card__meta">
            <span>${escapeHtml(post.category || 'Sem categoria')}</span>
            <time datetime="${escapeHtml(post.date || '')}">${formatDate(post.date || '')}</time>
          </div>
          <h3>${escapeHtml(post.title || 'Sem titulo')}</h3>
          <p>${escapeHtml(post.excerpt || post.description || 'Sem resumo cadastrado.')}</p>
          <dl>
            <div><dt>Slug</dt><dd>/blog/${escapeHtml(post.slug || '')}/</dd></div>
            <div><dt>Secoes</dt><dd>${sectionsCount}</dd></div>
            <div><dt>Schema extra</dt><dd>${schemaCount}</dd></div>
          </dl>
          <div class="content-card__actions">
            <button type="button" data-edit-slug="${escapeHtml(post.slug || '')}">Editar</button>
            <a href="/blog/${escapeHtml(post.slug || '')}/" target="_blank" rel="noopener">Abrir</a>
          </div>
        </article>`;
    })
    .join('');
};

const fillForm = (post) => {
  selectedSlug = post.slug || '';
  postForm.elements.title.value = post.title || '';
  postForm.elements.slug.value = post.slug || '';
  postForm.elements.category.value = post.category || '';
  postForm.elements.date.value = post.date || new Date().toISOString().slice(0, 10);
  postForm.elements.readTime.value = post.readTime || 'Leitura de 5 min';
  postForm.elements.cta.value = post.cta || 'Falar agora';
  postForm.elements.description.value = post.description || '';
  postForm.elements.excerpt.value = post.excerpt || '';
  postForm.elements.summary.value = post.summary || '';
  postForm.elements.whatsappText.value = post.whatsappText || '';
  postForm.elements.structuredDataText.value = structuredDataToText(post.structuredData);
  postForm.elements.sectionsText.value = sectionsToText(post.sections);
  renderList();
  renderContentOverview();
};

const loadPosts = async () => {
  setStatus('Carregando posts...');
  const response = await fetch('/api/posts', {
    headers: { 'x-admin-password': getPassword() },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Nao foi possivel carregar os posts.');
  posts = payload.posts || [];
  fillForm(posts[0] || {});
  setStatus('Posts carregados.');
};

loginButton.addEventListener('click', async () => {
  sessionStorage.setItem('tsl_admin_password', passwordInput.value);
  try {
    await loadPosts();
    loginPanel.hidden = true;
    workspace.hidden = false;
  } catch (error) {
    alert(error.message);
  }
});

postList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-slug]');
  if (!button) return;
  const post = posts.find((item) => item.slug === button.dataset.slug);
  if (post) fillForm(post);
});

contentGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-edit-slug]');
  if (!button) return;
  const post = posts.find((item) => item.slug === button.dataset.editSlug);
  if (post) {
    fillForm(post);
    postForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

newPostButton.addEventListener('click', () => {
  fillForm({
    date: new Date().toISOString().slice(0, 10),
    readTime: 'Leitura de 5 min',
    sections: [{ heading: 'Primeira secao', body: 'Escreva o conteudo aqui.' }],
  });
});

postForm.elements.title.addEventListener('input', () => {
  if (!selectedSlug) {
    postForm.elements.slug.value = slugify(postForm.elements.title.value);
  }
});

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = postForm.elements;
  let structuredData = [];
  try {
    structuredData = parseStructuredData(form.structuredDataText.value);
  } catch (error) {
    alert(`Dados estruturados invalidos: ${error.message}`);
    return;
  }

  const post = {
    slug: slugify(form.slug.value || form.title.value),
    title: form.title.value.trim(),
    category: form.category.value.trim(),
    date: form.date.value,
    readTime: form.readTime.value.trim(),
    description: form.description.value.trim(),
    excerpt: form.excerpt.value.trim(),
    summary: form.summary.value.trim(),
    cta: form.cta.value.trim(),
    whatsappText: form.whatsappText.value.trim(),
    structuredData,
    sections: textToSections(form.sectionsText.value),
  };

  if (!post.sections.length) {
    alert('Crie pelo menos uma secao usando o formato "## Titulo".');
    return;
  }

  setStatus('Salvando...');
  const response = await fetch('/api/save-post', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-password': getPassword(),
    },
    body: JSON.stringify({ post }),
  });
  const payload = await response.json();
  if (!response.ok) {
    setStatus(payload.error || 'Falha ao salvar.');
    return;
  }
  posts = payload.posts;
  fillForm(post);
  setStatus(payload.deployTriggered ? 'Salvo. Deploy disparado.' : 'Salvo. Configure o deploy hook para publicar automaticamente.');
});
