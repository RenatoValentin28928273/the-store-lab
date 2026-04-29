const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const ctaButton = document.getElementById("cta-btn");
const ctaInput = document.getElementById("cta-nome");

let scrollTicking = false;

const updateNavbarState = () => {
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }

  scrollTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateNavbarState);
      scrollTicking = true;
    }
  },
  { passive: true }
);

updateNavbarState();

if (hamburger && mobileMenu) {
  const setMobileMenuState = (isOpen) => {
    mobileMenu.classList.toggle("open", isOpen);
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  };

  hamburger.addEventListener("click", () => {
    setMobileMenuState(!mobileMenu.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
    }
  });
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".faq-question").forEach((currentButton) => {
      currentButton.setAttribute("aria-expanded", "false");
      currentButton.nextElementSibling?.classList.remove("open");
    });

    if (!isOpen && answer) {
      button.setAttribute("aria-expanded", "true");
      answer.classList.add("open");
    }
  });
});

document.querySelectorAll(".comp-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const panel = document.getElementById(`panel-${tab.dataset.tab}`);
    if (!panel) return;

    document.querySelectorAll(".comp-tab").forEach((currentTab) => {
      currentTab.classList.remove("active");
    });

    document.querySelectorAll(".comp-panel").forEach((currentPanel) => {
      currentPanel.classList.remove("active");
    });

    tab.classList.add("active");
    panel.classList.add("active");
  });
});

if (ctaButton && ctaInput) {
  ctaButton.addEventListener("click", () => {
    const value = ctaInput.value.trim();
    const message = value
      ? `Ola! Meu WhatsApp e ${value}. Gostaria de saber mais sobre os servicos da The Store Lab.`
      : "Ola! Gostaria de saber mais sobre os servicos da The Store Lab.";

    window.open(`https://wa.me/5542999655157?text=${encodeURIComponent(message)}`, "_blank");
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length) {
  document.body.classList.add("reveal-ready");

  if (shouldReduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}
