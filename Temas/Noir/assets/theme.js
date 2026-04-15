(function () {
  const AUTO_PLAY_INTERVAL_MS = 5000;
  const TOP_OFFSET_SELECTORS = [
    'html',
    'body',
    '#shopify-section-announcement-bar',
    '.shopify-section-group-header-group',
    'body > *:first-child' // Adicionado para tentar remover espaço do primeiro elemento filho do body
  ];

  function clearTopOffsets() {
    TOP_OFFSET_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        element.style.setProperty('margin-top', '0px', 'important');
        element.style.setProperty('padding-top', '0px', 'important');
        element.style.setProperty('top', '0px', 'important');
      });
    });
  }

  function initAnnouncementCarousel(carousel) {
    if (!carousel || carousel.dataset.announcementReady === 'true') {
      return;
    }

    const track = carousel.querySelector('[data-announcement-track]');
    const prevBtn = carousel.querySelector('[data-announcement-prev]');
    const nextBtn = carousel.querySelector('[data-announcement-next]');
    const controls = carousel.querySelector('[data-announcement-controls]');
    const slides = Array.from(carousel.querySelectorAll('[data-announcement-slide]')).filter(function (slide) {
      return slide.textContent.trim().length > 0;
    });

    if (!track || slides.length === 0) {
      return;
    }

    let currentIndex = 0;
    let autoPlayTimer = null;

    function updateSlide() {
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateSlide();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function stopAutoPlay() {
      if (!autoPlayTimer) {
        return;
      }

      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }

    function startAutoPlay() {
      const isEditorMode = Boolean(window.Shopify && window.Shopify.designMode);

      if (slides.length <= 1 || isEditorMode) {
        return;
      }

      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL_MS);
    }

    if (controls) {
      controls.hidden = slides.length <= 1;
    }

    if (slides.length > 1) {
      if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
      }

      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
      carousel.addEventListener('focusin', stopAutoPlay);
      carousel.addEventListener('focusout', startAutoPlay);
    }

    updateSlide();
    startAutoPlay();

    carousel.__announcementGoTo = function (slideElement) {
      const index = slides.indexOf(slideElement);

      if (index >= 0) {
        goToSlide(index);
      }
    };

    carousel.__announcementCleanup = function () {
      stopAutoPlay();
    };

    carousel.dataset.announcementReady = 'true';
  }

  function mountAnnouncementCarousels(scope) {
    scope.querySelectorAll('[data-announcement-carousel]').forEach(initAnnouncementCarousel);
  }

  function mountAll() {
    clearTopOffsets();
    mountAnnouncementCarousels(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    clearTopOffsets();
    mountAnnouncementCarousels(event.target);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    event.target.querySelectorAll('[data-announcement-carousel]').forEach(function (carousel) {
      if (typeof carousel.__announcementCleanup === 'function') {
        carousel.__announcementCleanup();
      }
    });
  });

  document.addEventListener('shopify:block:select', function (event) {
    const slide = event.target.closest('[data-announcement-slide]');

    if (!slide) {
      return;
    }

    const carousel = slide.closest('[data-announcement-carousel]');

    if (carousel && typeof carousel.__announcementGoTo === 'function') {
      carousel.__announcementGoTo(slide);
    }
  });

  window.addEventListener('load', clearTopOffsets);
})();
