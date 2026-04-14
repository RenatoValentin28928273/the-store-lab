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
  #onKeyUpHandler = null;
  #onDetailsToggleHandler = null;
  #onMenuItemClickHandler = null;
  #onMenuItemHoverHandler = null;

  connectedCallback() {
    super.connectedCallback();
    this.#onKeyUpHandler = this.#onKeyUp.bind(this);
    this.#onDetailsToggleHandler = this.#onDetailsToggle.bind(this);
    this.#onMenuItemClickHandler = this.#onMenuItemClick.bind(this);
    this.#onMenuItemHoverHandler = this.#onMenuItemHover.bind(this);
    this.addEventListener('keyup', this.#onKeyUpHandler);
    this.addEventListener('toggle', this.#onDetailsToggleHandler, true);
    this.addEventListener('click', this.#onMenuItemClickHandler, true);
    this.addEventListener('mouseover', this.#onMenuItemHoverHandler, true);
    this.addEventListener('focusin', this.#onMenuItemHoverHandler, true);
    this.#setupAnimatedElementListeners();
    this.#initJimBackdrop();
    this.#backdrop?.addEventListener('click', () => this.close());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#onKeyUpHandler) this.removeEventListener('keyup', this.#onKeyUpHandler);
    if (this.#onDetailsToggleHandler) this.removeEventListener('toggle', this.#onDetailsToggleHandler, true);
    if (this.#onMenuItemClickHandler) this.removeEventListener('click', this.#onMenuItemClickHandler, true);
    if (this.#onMenuItemHoverHandler) {
      this.removeEventListener('mouseover', this.#onMenuItemHoverHandler, true);
      this.removeEventListener('focusin', this.#onMenuItemHoverHandler, true);
    }
    this.#cleanupBackdrop();
  }

  #initJimBackdrop() {
    this.#backdrop = document.createElement('div');
    this.#backdrop.className = 'jim-menu-backdrop';
    this.#backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);z-index:15;opacity:0;transition:opacity 0.4s cubic-bezier(0.16,1,0.3,1);pointer-events:none;';
    this.appendChild(this.#backdrop);
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
    if (this.#isDesktopMenuLayout() && details === this.refs.details) return;

    summary.setAttribute('aria-expanded', 'true');
    this.preventInitialAccordionAnimations(details);

    requestAnimationFrame(() => {
      details.classList.add('menu-open');
      if (target) this.refs.menuDrawer.classList.add('menu-drawer--has-submenu-opened');

      // Jim full overlay
      this.refs.menuDrawer.classList.add('jim-menu-open');
      this.#clearActiveDesktopPanel();
      if (this.#backdrop) {
        this.#backdrop.style.opacity = '1';
        this.#backdrop.style.pointerEvents = 'auto';
      }

      const drawer = details.querySelector('.menu-drawer, .menu-drawer__submenu');
      onAnimationEnd(drawer || details, () => trapFocus(details), { subtree: false });
    });
  }

  #isDesktopMenuLayout() {
    return window.matchMedia('(min-width: 990px)').matches;
  }

  #onDetailsToggle(event) {
    if (!this.#isDesktopMenuLayout()) return;
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement)) return;
    if (!details.classList.contains('menu-drawer__menu-container')) return;
    if (!details.open) return;

    const containers = this.querySelectorAll('.menu-drawer__menu-container');
    containers.forEach(container => {
      if (container !== details) {
        container.open = false;
        container.classList.remove('menu-open');
        container.querySelector('summary')?.setAttribute('aria-expanded', 'false');
      }
    });
    details.classList.add('menu-open');
    details.querySelector('summary')?.setAttribute('aria-expanded', 'true');
  }

  #openFirstDesktopSubmenu() {
    if (!this.#isDesktopMenuLayout()) return;
    const firstMenuWithChildren = this.querySelector('[data-desktop-panel-target][data-desktop-has-children="true"]');
    if (firstMenuWithChildren?.dataset.desktopPanelTarget) {
      this.#setActiveDesktopPanel(firstMenuWithChildren.dataset.desktopPanelTarget);
      return;
    }

    const firstPanel = this.querySelector('.menu-drawer__desktop-panel');
    if (firstPanel?.dataset.desktopPanel) {
      this.#setActiveDesktopPanel(firstPanel.dataset.desktopPanel);
      return;
    }

    const containers = [...this.querySelectorAll('.menu-drawer__menu-container')];
    const first = containers.find(container => container.querySelector(':scope > .menu-drawer__submenu'));
    if (!first) return;

    first.open = true;
    first.classList.add('menu-open');
    first.querySelector('summary')?.setAttribute('aria-expanded', 'true');
    containers.forEach(container => {
      if (container !== first) {
        container.open = false;
        container.classList.remove('menu-open');
        container.querySelector('summary')?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  #onMenuItemClick(event) {
    if (!this.#isDesktopMenuLayout()) return;
    const target = event.target instanceof Element ? event.target.closest('[data-desktop-panel-target]') : null;
    if (!(target instanceof HTMLElement)) return;
    if (!this.contains(target)) return;

    const panelId = target.dataset.desktopPanelTarget;
    if (!panelId) return;

    const hasChildren = target.dataset.desktopHasChildren === 'true';
    if (!hasChildren) {
      this.#clearActiveDesktopPanel();
      return;
    }
    event.preventDefault();
    this.#setActiveDesktopPanel(panelId);
  }

  #onMenuItemHover(event) {
    if (!this.#isDesktopMenuLayout()) return;
    if (event.type === 'mouseover' && !(event.target instanceof Element)) return;
    const target = event.target instanceof Element ? event.target.closest('[data-desktop-panel-target]') : null;
    if (!(target instanceof HTMLElement)) return;
    if (!this.contains(target)) return;

    // Ignore internal mouse transitions inside the same menu item.
    if (event.type === 'mouseover') {
      const related = event.relatedTarget;
      if (related instanceof Node && target.contains(related)) return;
    }

    const panelId = target.dataset.desktopPanelTarget;
    if (!panelId) return;
    const hasChildren = target.dataset.desktopHasChildren === 'true';
    if (!hasChildren) {
      this.#clearActiveDesktopPanel();
      return;
    }
    this.#setActiveDesktopPanel(panelId);
  }

  #clearActiveDesktopPanel() {
    this.querySelectorAll('.menu-drawer__desktop-panel').forEach(panel => {
      panel.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
    });
    this.querySelectorAll('[data-desktop-panel-target]').forEach(link => link.classList.remove('is-active'));
    this.refs.menuDrawer?.classList.remove('has-active-desktop-panel');
  }

  #setActiveDesktopPanel(panelId) {
    const panels = this.querySelectorAll('.menu-drawer__desktop-panel');
    if (!panels.length) {
      this.#clearActiveDesktopPanel();
      return;
    }

    let hasMatch = false;
    panels.forEach(panel => {
      const isActive = panel.dataset.desktopPanel === panelId;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      if (isActive) hasMatch = true;
    });

    if (!hasMatch) {
      this.#clearActiveDesktopPanel();
      return;
    }

    this.querySelectorAll('[data-desktop-panel-target]').forEach(link => {
      link.classList.toggle('is-active', link.dataset.desktopPanelTarget === panelId);
    });
    this.refs.menuDrawer?.classList.add('has-active-desktop-panel');
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
    this.#clearActiveDesktopPanel();
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
