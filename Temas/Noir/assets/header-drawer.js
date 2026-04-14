import { Component } from '@theme/component';
import { trapFocus, removeTrapFocus } from '@theme/focus';
import { onAnimationEnd, removeWillChangeOnAnimationEnd } from '@theme/utilities';

/**
 * HeaderDrawer - Jim Thompson overlay style
 * @extends Component
 */
class HeaderDrawer extends Component {
  static requiredRefs = ['details', 'menuDrawer'];

  #backdrop = null;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keyup', this.#onKeyUp.bind(this));
    this.#setupAnimatedElementListeners();
    this.#initJimBackdrop();
    this.#backdrop?.addEventListener('click', () => this.close());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keyup', this.#onKeyUp);
    this.#cleanupBackdrop();
  }

  #initJimBackdrop() {
    this.#backdrop = document.createElement('div');
    this.#backdrop.className = 'jim-menu-backdrop';
    this.#backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:9998;opacity:0;transition:opacity 0.4s cubic-bezier(0.16,1,0.3,1);pointer-events:none;';
    document.body.appendChild(this.#backdrop);
  }

  #cleanupBackdrop() {
    if (this.#backdrop?.parentNode) {
      this.#backdrop.parentNode.removeChild(this.#backdrop);
    }
  }

  #onKeyUp(event) {
    if (event.key !== 'Escape') return;
    this.#close(this.#getDetailsElement(event));
  }

  get isOpen() {
    return this.refs.details.hasAttribute('open');
  }

  #getDetailsElement(event) {
    if (!(event?.target instanceof Element)) return this.refs.details;
    return event.target.closest('details') ?? this.refs.details;
  }

  toggle() {
    return this.isOpen ? this.close() : this.open();
  }

  open(target, event) {
    const details = this.#getDetailsElement(event);
    const summary = details.querySelector('summary');
    if (!summary) return;

    summary.setAttribute('aria-expanded', 'true');
    this.preventInitialAccordionAnimations(details);

    requestAnimationFrame(() => {
      details.classList.add('menu-open');
      if (target) this.refs.menuDrawer.classList.add('menu-drawer--has-submenu-opened');

      // Jim full overlay
      this.refs.menuDrawer.classList.add('jim-menu-open');
      if (this.#backdrop) {
        this.#backdrop.style.opacity = '1';
        this.#backdrop.style.pointerEvents = 'auto';
      }

      const drawer = details.querySelector('.menu-drawer, .menu-drawer__submenu');
      onAnimationEnd(drawer || details, () => trapFocus(details), { subtree: false });
    });
  }

  back(event) {
    this.#close(this.#getDetailsElement(event));
  }

  close() {
    this.#close(this.refs.details);
  }

  #close(details) {
    const summary = details.querySelector('summary');
    if (!summary) return;

    summary.setAttribute('aria-expanded', 'false');
    details.classList.remove('menu-open');
    this.refs.menuDrawer.classList.remove('menu-drawer--has-submenu-opened', 'jim-menu-open');
    if (this.#backdrop) {
      this.#backdrop.style.opacity = '0';
      this.#backdrop.style.pointerEvents = 'none';
    }

    const drawer = details.querySelector('.menu-drawer, .menu-drawer__submenu');
    onAnimationEnd(drawer || details, () => {
      if (details === this.refs.details) {
        removeTrapFocus();
        [...this.querySelectorAll('details[open]:not(accordion-custom > details)')].forEach(reset);
      } else {
        trapFocus(this.refs.details);
      }
    }, { subtree: false });
  }

  #setupAnimatedElementListeners() {
    this.querySelectorAll('.menu-drawer__animated-element').forEach(el => {
      el.addEventListener('animationend', removeWillChangeOnAnimationEnd);
    });
  }

  preventInitialAccordionAnimations(details) {
    details.querySelectorAll('accordion-custom .details-content').forEach(el => {
      if (el instanceof HTMLElement) el.classList.add('details-content--no-animation');
    });
    setTimeout(() => {
      details.querySelectorAll('accordion-custom .details-content').forEach(el => {
        if (el instanceof HTMLElement) el.classList.remove('details-content--no-animation');
      });
    }, 100);
  }
}

if (!customElements.get('header-drawer')) customElements.define('header-drawer', HeaderDrawer);

function reset(element) {
  element.classList.remove('menu-open');
  element.removeAttribute('open');
  element.querySelector('summary')?.setAttribute('aria-expanded', 'false');
}

