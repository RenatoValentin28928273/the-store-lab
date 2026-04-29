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
const sectionsEditor = document.getElementById('sectionsEditor');
const addSectionButton = document.getElementById('addSectionButton');

let posts = [];
let selectedSlug = '';
let savedEditorRange = null;

const slugify = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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

const readApiPayload = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    return {
      error: text || 'A API retornou uma resposta invalida.',
    };
  }
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

const isHtml = (value = '') => /<\/?[a-z][\s\S]*>/i.test(String(value));

const textToHtml = (value = '') =>
  String(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');

const sanitizeHtml = (html = '') => {
  const allowedTags = new Set(['A', 'B', 'BR', 'EM', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'UL']);
  const template = document.createElement('template');
  template.innerHTML = html;

  const cleanNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || '');
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createDocumentFragment();

    const fragment = document.createDocumentFragment();
    const tagName = node.tagName.toUpperCase();
    if (!allowedTags.has(tagName)) {
      node.childNodes.forEach((child) => fragment.appendChild(cleanNode(child)));
      return fragment;
    }

    const element = document.createElement(tagName.toLowerCase());
    if (tagName === 'A') {
      const href = node.getAttribute('href') || '';
      const isSafeHref = /^(https?:|mailto:|tel:|#)/i.test(href);
      if (isSafeHref) {
        element.setAttribute('href', href);
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener');
      }
    }
    if (tagName === 'SPAN') {
      const fontWeight = node.style.fontWeight;
      if (/^(400|500|600|700|800|900|normal|bold)$/.test(fontWeight)) {
        element.style.fontWeight = fontWeight;
      }
    }
    node.childNodes.forEach((child) => element.appendChild(cleanNode(child)));
    return element;
  };

  const container = document.createElement('div');
  template.content.childNodes.forEach((child) => container.appendChild(cleanNode(child)));
  return container.innerHTML;
};

const sectionBodyToHtml = (body = '') => {
  const value = String(body || '').trim();
  if (!value) return '';
  return sanitizeHtml(isHtml(value) ? value : textToHtml(value));
};

const syncSectionsText = () => {
  postForm.elements.sectionsText.value = getSectionsFromEditor()
    .map((section) => `## ${section.heading}\n${section.body}`)
    .join('\n\n');
};

const createToolbarButton = (label, command, title) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.command = command;
  button.title = title;
  return button;
};

const createFontWeightSelect = () => {
  const select = document.createElement('select');
  select.dataset.command = 'fontWeight';
  select.title = 'Peso da fonte';
  [
    ['Peso da fonte', ''],
    ['Normal', '400'],
    ['Medio', '500'],
    ['Semibold', '600'],
    ['Bold', '700'],
    ['Extra bold', '800'],
  ].forEach(([label, value]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
  return select;
};

const updateSavedSelection = () => {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);
  const editor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer.closest?.('.rich-editor')
    : range.commonAncestorContainer.parentElement?.closest('.rich-editor');
  if (editor) savedEditorRange = range.cloneRange();
};

const restoreSavedSelection = () => {
  if (!savedEditorRange) return false;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedEditorRange);
  return true;
};

const replaceSelectedText = (transform) => {
  restoreSavedSelection();
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const editor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer.closest?.('.rich-editor')
    : range.commonAncestorContainer.parentElement?.closest('.rich-editor');
  if (!editor) return;

  const selectedText = selection.toString();
  range.deleteContents();
  range.insertNode(document.createTextNode(transform(selectedText)));
  selection.removeAllRanges();
  syncSectionsText();
};

const wrapSelection = (tagName, attributes = {}) => {
  restoreSavedSelection();
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const editor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer.closest?.('.rich-editor')
    : range.commonAncestorContainer.parentElement?.closest('.rich-editor');
  if (!editor) return;

  const wrapper = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => wrapper.setAttribute(key, value));
  wrapper.appendChild(range.extractContents());
  range.insertNode(wrapper);
  selection.removeAllRanges();
  savedEditorRange = null;
  syncSectionsText();
};

const applyFontWeight = (weight) => {
  if (!weight) return;
  wrapSelection('span', { style: `font-weight: ${weight};` });
};

const removeBoldFromSelection = () => {
  restoreSavedSelection();
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);
  const text = selection.toString();
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  selection.removeAllRanges();
  savedEditorRange = null;
  syncSectionsText();
};

const createSectionBlock = (section = {}) => {
  const block = document.createElement('article');
  block.className = 'section-block';

  const top = document.createElement('div');
  top.className = 'section-block__top';

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Titulo da secao';
  const titleInput = document.createElement('input');
  titleInput.className = 'section-heading-input';
  titleInput.placeholder = 'Ex: Como Shopify funciona?';
  titleInput.value = section.heading || '';
  titleLabel.appendChild(titleInput);

  const removeButton = document.createElement('button');
  removeButton.className = 'section-block__remove';
  removeButton.type = 'button';
  removeButton.textContent = 'Remover';
  removeButton.dataset.removeSection = 'true';

  top.append(titleLabel, removeButton);

  const toolbar = document.createElement('div');
  toolbar.className = 'section-toolbar';
  toolbar.append(
    createToolbarButton('B', 'bold', 'Negrito'),
    createToolbarButton('I', 'italic', 'Italico'),
    createToolbarButton('Lista', 'insertUnorderedList', 'Lista com marcadores'),
    createToolbarButton('1.', 'insertOrderedList', 'Lista numerada'),
    createToolbarButton('Link', 'createLink', 'Adicionar link'),
    createFontWeightSelect(),
    createToolbarButton('Normal', 'removeBold', 'Remover negrito da selecao'),
    createToolbarButton('AA', 'uppercase', 'Transformar selecao em maiusculas'),
    createToolbarButton('aa', 'lowercase', 'Transformar selecao em minusculas'),
    createToolbarButton('Limpar', 'removeFormat', 'Remover formatacao')
  );

  const editorLabel = document.createElement('label');
  editorLabel.textContent = 'Conteudo da secao';
  const editor = document.createElement('div');
  editor.className = 'rich-editor';
  editor.contentEditable = 'true';
  editor.dataset.placeholder = 'Escreva ou cole o conteudo aqui, como em um editor de texto.';
  editor.innerHTML = sectionBodyToHtml(section.body);
  editorLabel.appendChild(editor);

  block.append(top, toolbar, editorLabel);
  return block;
};

const renderSectionsEditor = (sections = []) => {
  sectionsEditor.innerHTML = '';
  const safeSections = sections.length ? sections : [{ heading: '', body: '' }];
  safeSections.forEach((section) => sectionsEditor.appendChild(createSectionBlock(section)));
  syncSectionsText();
};

const getSectionsFromEditor = () =>
  [...sectionsEditor.querySelectorAll('.section-block')]
    .map((block) => {
      const heading = block.querySelector('.section-heading-input')?.value.trim() || '';
      const editor = block.querySelector('.rich-editor');
      const body = sanitizeHtml(editor?.innerHTML || '').trim();
      const text = editor?.textContent.trim() || '';
      return { heading, body, text };
    })
    .filter((section) => section.heading && section.text)
    .map(({ heading, body }) => ({ heading, body }));

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
  renderSectionsEditor(Array.isArray(post.sections) ? post.sections : []);
  renderList();
  renderContentOverview();
};

const loadPosts = async () => {
  setStatus('Carregando posts...');
  const response = await fetch('/api/posts', {
    headers: { 'x-admin-password': getPassword() },
  });
  const payload = await readApiPayload(response);
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
    sections: [{ heading: '', body: '' }],
  });
});

postForm.elements.title.addEventListener('input', () => {
  if (!selectedSlug) {
    postForm.elements.slug.value = slugify(postForm.elements.title.value);
  }
});

addSectionButton.addEventListener('click', () => {
  sectionsEditor.appendChild(createSectionBlock({ heading: '', body: '' }));
  syncSectionsText();
  sectionsEditor.lastElementChild?.querySelector('.section-heading-input')?.focus();
});

sectionsEditor.addEventListener('input', syncSectionsText);

sectionsEditor.addEventListener('keyup', updateSavedSelection);
sectionsEditor.addEventListener('mouseup', updateSavedSelection);

sectionsEditor.addEventListener('mousedown', (event) => {
  if (event.target.closest('button[data-command]')) event.preventDefault();
});

sectionsEditor.addEventListener('change', (event) => {
  const select = event.target.closest('select[data-command="fontWeight"]');
  if (!select) return;
  applyFontWeight(select.value);
  select.value = '';
});

sectionsEditor.addEventListener('paste', (event) => {
  const editor = event.target.closest('.rich-editor');
  if (!editor) return;
  event.preventDefault();
  const html = event.clipboardData?.getData('text/html');
  const text = event.clipboardData?.getData('text/plain') || '';
  const content = html ? sanitizeHtml(html) : textToHtml(text);
  document.execCommand('insertHTML', false, content);
  syncSectionsText();
});

sectionsEditor.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-section]');
  if (removeButton) {
    const blocks = sectionsEditor.querySelectorAll('.section-block');
    if (blocks.length === 1) {
      const block = blocks[0];
      block.querySelector('.section-heading-input').value = '';
      block.querySelector('.rich-editor').innerHTML = '';
    } else {
      removeButton.closest('.section-block')?.remove();
    }
    syncSectionsText();
    return;
  }

  const toolbarButton = event.target.closest('[data-command]');
  if (!toolbarButton) return;

  const block = toolbarButton.closest('.section-block');
  const editor = block?.querySelector('.rich-editor');
  editor?.focus();

  const command = toolbarButton.dataset.command;
  if (command === 'createLink') {
    const url = window.prompt('Cole a URL do link');
    if (url) document.execCommand(command, false, url);
  } else if (command === 'removeBold') {
    removeBoldFromSelection();
  } else if (command === 'uppercase') {
    replaceSelectedText((value) => value.toUpperCase());
  } else if (command === 'lowercase') {
    replaceSelectedText((value) => value.toLowerCase());
  } else {
    document.execCommand(command, false, null);
  }
  syncSectionsText();
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
    sections: getSectionsFromEditor(),
  };

  if (!post.sections.length) {
    alert('Crie pelo menos uma secao com titulo e conteudo.');
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
  const payload = await readApiPayload(response);
  if (!response.ok) {
    setStatus(payload.error || 'Falha ao salvar.');
    return;
  }
  posts = payload.posts;
  fillForm(post);
  setStatus(payload.deployTriggered ? 'Salvo. Deploy disparado.' : 'Salvo. Deploy automatico via GitHub iniciado.');
});
