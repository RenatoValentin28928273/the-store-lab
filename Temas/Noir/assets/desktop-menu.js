const DESKTOP_BREAKPOINT_QUERY = '(min-width: 990px)';
const DESKTOP_BREAKPOINT = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);
const instances = new WeakMap();

class DesktopMenuController {
  constructor(toggle) {
    this.toggle = toggle;
    this.drawerId = this.toggle.getAttribute('aria-controls');
    this.drawer = this.drawerId ? document.getElementById(this.drawerId) : null;
    this.overlay = this.drawer?.querySelector('[data-desktop-menu-overlay]') ?? null;
    this.closeButton = this.drawer?.querySelector('[data-desktop-menu-close]') ?? null;
    this.isReady = Boolean(this.drawer);

    if (!this.isReady) return;

    this.onToggleClick = this.onToggleClick.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);

    this.toggle.setAttribute('aria-expanded', 'false');
    this.drawer.setAttribute('aria-hidden', 'true');

    this.toggle.addEventListener('click', this.onToggleClick, true);
    this.overlay?.addEventListener('click', this.onOverlayClick);
    this.closeButton?.addEventListener('click', this.onCloseClick);
    document.addEventListener('keydown', this.onKeyDown);

    if (typeof DESKTOP_BREAKPOINT.addEventListener === 'function') {
      DESKTOP_BREAKPOINT.addEventListener('change', this.onBreakpointChange);
    } else {
      DESKTOP_BREAKPOINT.addListener(this.onBreakpointChange);
    }
  }

  isDesktop() {
    return DESKTOP_BREAKPOINT.matches;
  }

  isOpen() {
    return this.drawer?.classList.contains('is-open');
  }

  open() {
    if (!this.isDesktop() || !this.drawer || this.isOpen()) return;
    this.syncNativeDrawerClosed();

    document.querySelectorAll('.desktop-menu-drawer.is-open').forEach((openedDrawer) => {
      if (!(openedDrawer instanceof HTMLElement) || openedDrawer === this.drawer) return;
      openedDrawer.classList.remove('is-open');
      openedDrawer.setAttribute('aria-hidden', 'true');
      const relatedToggle = document.querySelector(`[data-desktop-menu-toggle][aria-controls="${openedDrawer.id}"]`);
      if (relatedToggle instanceof HTMLElement) relatedToggle.setAttribute('aria-expanded', 'false');
    });

    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('desktop-menu-open');
  }

  close({ restoreFocus = false } = {}) {
    if (!this.drawer || !this.isOpen()) return;

    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.syncNativeDrawerClosed();

    if (!document.querySelector('.desktop-menu-drawer.is-open')) {
      document.body.classList.remove('desktop-menu-open');
    }

    if (restoreFocus) this.toggle.focus();
  }

  onToggleClick(event) {
    if (!this.isDesktop()) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  onOverlayClick(event) {
    event.preventDefault();
    this.close();
  }

  onCloseClick(event) {
    event.preventDefault();
    this.close({ restoreFocus: true });
  }

  onKeyDown(event) {
    if (event.key !== 'Escape' || !this.isOpen()) return;
    this.close({ restoreFocus: true });
  }

  onBreakpointChange(event) {
    if (event.matches) {
      this.syncNativeDrawerClosed();
      return;
    }
    this.close();
  }

  syncNativeDrawerClosed() {
    const details = this.toggle.closest('details.menu-drawer-container');
    if (details instanceof HTMLDetailsElement) {
      details.open = false;
      details.classList.remove('menu-open');
      details.querySelector('summary')?.setAttribute('aria-expanded', 'false');
      const nativeDrawer = details.querySelector('.menu-drawer');
      if (nativeDrawer instanceof HTMLElement) {
        nativeDrawer.classList.remove('menu-drawer--has-submenu-opened', 'jim-menu-open');
      }
    }

    const host = this.toggle.closest('header-drawer');
    if (host instanceof HTMLElement) {
      host.querySelectorAll('.jim-menu-backdrop').forEach((backdrop) => {
        if (!(backdrop instanceof HTMLElement)) return;
        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';
      });
    }
  }

  destroy() {
    if (!this.isReady) return;
    this.close();
    this.toggle.removeEventListener('click', this.onToggleClick, true);
    this.overlay?.removeEventListener('click', this.onOverlayClick);
    this.closeButton?.removeEventListener('click', this.onCloseClick);
    document.removeEventListener('keydown', this.onKeyDown);

    if (typeof DESKTOP_BREAKPOINT.removeEventListener === 'function') {
      DESKTOP_BREAKPOINT.removeEventListener('change', this.onBreakpointChange);
    } else {
      DESKTOP_BREAKPOINT.removeListener(this.onBreakpointChange);
    }
  }
}

function initDesktopMenus(root = document) {
  if (!(root instanceof Element || root instanceof Document)) return;

  root.querySelectorAll('[data-desktop-menu-toggle]').forEach((toggle) => {
    if (instances.has(toggle)) return;
    const controller = new DesktopMenuController(toggle);
    if (!controller.isReady) return;
    instances.set(toggle, controller);
  });
}

function cleanupDesktopMenus(root = document) {
  if (!(root instanceof Element || root instanceof Document)) return;

  root.querySelectorAll('[data-desktop-menu-toggle]').forEach((toggle) => {
    const controller = instances.get(toggle);
    if (!controller) return;
    controller.destroy();
    instances.delete(toggle);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initDesktopMenus());
} else {
  initDesktopMenus();
}

document.addEventListener('shopify:section:load', (event) => {
  const root = event.target instanceof Element ? event.target : document;
  initDesktopMenus(root);
});

document.addEventListener('shopify:section:unload', (event) => {
  const root = event.target instanceof Element ? event.target : document;
  cleanupDesktopMenus(root);
});
