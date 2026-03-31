/* ============================
   hub.js — Lógica do hub de serviços
   ============================ */

// ── FILTROS POR CATEGORIA ──
const filters = document.querySelectorAll('.hub-filter');
const cards = document.querySelectorAll('.hub-card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    // Atualiza active
    filters.forEach(f => f.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hub-hidden');
        // Re-ativa revelação se necessário, mas removemos animação inline que quebra o balanço
        card.classList.add('revealed');
      } else {
        card.classList.add('hub-hidden');
      }
    });
  });
});

// REMOVIDO: Observadores de interseção redundantes que usavam estilos inline.
// O arquivo script.js agora gerencia a revelação (classe .revealed) e o balanço (Sway) de todos os cards globalmente.

// ── KEYBOARD NAV NOS CARDS ──
cards.forEach(card => {
  card.setAttribute('tabindex', '0');
  const link = card.querySelector('.hub-card-cta');
  if (link) {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        window.location.href = link.href;
      }
    });
  }
});

// Altura do sticky filters bar
const filtersBar = document.querySelector('.hub-filters-bar');
if (filtersBar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      filtersBar.classList.add('has-shadow');
    } else {
      filtersBar.classList.remove('has-shadow');
    }
  });
}
