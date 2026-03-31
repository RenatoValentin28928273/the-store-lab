/* ============================
   THE LAB STORE — SCRIPT.JS
   ============================ */

// ====== HERO STARFIELD CANVAS ======
(function initStarfield() {
  const canvas = document.getElementById('heroStars');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height, stars = [];

  function setSize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Star {
    constructor() {
      this.init();
    }
    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5;
      this.speed = Math.random() * 0.05 + 0.01;
      this.opacity = Math.random();
    }
    update() {
      this.y -= this.speed;
      if (this.y < 0) this.init();
    }
    draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function setup() {
    setSize();
    stars = [];
    for (let i = 0; i < 150; i++) stars.push(new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animate);
  }

  setup();
  animate();
  window.addEventListener('resize', setup);
})();

// ====== NAVBAR SCROLL EFFECT ======
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar && window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else if (navbar) {
    navbar.classList.remove('scrolled');
  }
});

// ====== MOBILE MENU TOGGLE ======
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ====== SCROLL REVEAL ANIMATION ======
const revealElements = document.querySelectorAll('.service-item, .metric-card, .testimonial-card, .process-step, .stat-item, .result-card, .deliverable-card, .serv-process-item, .serv-testimonial-wrap, .reveal, .hub-card, .hub-guide-card, .serv-badge, .faq-item, .serv-stat-card, .diff-card-big');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback para navegadores antigos
  revealElements.forEach(el => el.classList.add('revealed', 'visible'));
}

// ====== READING PROGRESS BAR ======
const initReadingProgress = () => {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'reading-progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.id = 'readingBar';
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const bar = document.getElementById('readingBar');
    if (bar) bar.style.width = scrolled + '%';
  });
};

// ====== BACK TO TOP BUTTON ======
const initBackToTop = () => {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Voltar ao topo');
  btn.setAttribute('title', 'Voltar ao topo');
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg><span class="sr-only">Voltar ao topo</span>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// ====== FOOTER YEAR UPDATE ======
const updateFooterYear = () => {
  const currentYear = new Date().getFullYear();
  const yearElements = document.querySelectorAll('.footer-bottom p, .copyright-year');
  yearElements.forEach(el => {
    if (el.textContent.includes('©')) {
      el.textContent = el.textContent.replace(/202[0-9]/, currentYear > 2026 ? currentYear : 2026);
    }
  });
};

// ====== ACCORDION (FAQ) ======
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (!question) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    
    // Close others
    faqItems.forEach(other => {
      other.classList.remove('active');
      const otherBtn = other.querySelector('.faq-question');
      if (otherBtn) {
        otherBtn.setAttribute('aria-expanded', 'false');
        const otherIcon = otherBtn.querySelector('.faq-icon');
        if (otherIcon) otherIcon.textContent = '+';
      }
    });

    if (!isOpen) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
      const icon = question.querySelector('.faq-icon');
      if (icon) icon.textContent = '−';
    }
  });
});

// ====== LOGO BUBBLE ANIMATION ======
const initLogoBubbles = () => {
  const logoBoxes = document.querySelectorAll('.logo-box');
  if (logoBoxes.length === 0) return;

  const createBubble = (box) => {
    const bubble = document.createElement('div');
    bubble.className = 'logo-bubble';
    
    // Tamanho aleatório (3px a 7px)
    const size = Math.random() * 4 + 3;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    // Posição horizontal centrada no bocal do funil
    const boxWidth = box.offsetWidth || 32;
    const leftPos = (boxWidth / 2) + (Math.random() * 6 - 3); 
    bubble.style.left = leftPos + 'px';
    bubble.style.top = '8px'; // Início no topo do círculo do pote
    
    box.appendChild(bubble);
    
    // Remove após a animação
    setTimeout(() => {
      if (bubble.parentElement) bubble.remove();
    }, 2500);
  };

  logoBoxes.forEach(box => {
    // Cria bolhas em intervalos variados para parecer natural
    const startBubbles = () => {
      createBubble(box);
      setTimeout(startBubbles, Math.random() * 1000 + 400);
    };
    startBubbles();
  });
};

// ====== INITIALIZE WORKFLOW ======
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initReadingProgress();
  initBackToTop();
  updateFooterYear();
  initLogoBubbles(); // Iniciando as bolhas do logo

  const heroContent = document.querySelector('.hero-inner');
  if (heroContent) {
    heroContent.classList.add('revealed');
  }
});


