(() => {
  'use strict';

  const ACTIVE_CLASS = 'ytfw-active';
  const ANCESTOR_CLASS = 'ytfw-anc';
  const BTN_CLASS = 'ytfw-btn';
  const TITLE_OFF = 'Full window (Alt+T)';
  const TITLE_ON = 'Exit full window (Esc / Alt+T)';

  // Corner brackets pointing outward: reads as "fill the window".
  const ICON =
    '<svg viewBox="0 0 36 36" fill="none" stroke="#fff" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M9 14V9h5M22 9h5v5M27 22v5h-5M14 27H9v-5"/></svg>';

  const root = document.documentElement;
  const isActive = () => root.classList.contains(ACTIVE_CLASS);
  const isWatchPage = () => location.pathname === '/watch';

  function setAncestorTags(player, on) {
    for (let el = player && player.parentElement; el && el !== root; el = el.parentElement) {
      el.classList.toggle(ANCESTOR_CLASS, on);
    }
    if (!on) {
      document.querySelectorAll('.' + ANCESTOR_CLASS).forEach((el) => el.classList.remove(ANCESTOR_CLASS));
    }
  }

  function syncButton() {
    const btn = document.querySelector('.' + BTN_CLASS);
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(isActive()));
    btn.title = isActive() ? TITLE_ON : TITLE_OFF;
    btn.setAttribute('aria-label', btn.title);
  }

  function setActive(on) {
    const player = document.getElementById('movie_player');
    if (on && (!player || !isWatchPage())) return;
    setAncestorTags(player, on);
    root.classList.toggle(ACTIVE_CLASS, on);
    syncButton();
    // The player recomputes its layout on resize; nudge it now and once layout settles.
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
  }

  const toggle = () => setActive(!isActive());

  function ensureButton() {
    if (!isWatchPage() || document.querySelector('.' + BTN_CLASS)) return;
    const sizeBtn = document.querySelector('#movie_player .ytp-size-button');
    const controls = document.querySelector('#movie_player .ytp-right-controls');
    if (!sizeBtn && !controls) return;

    // Clone a native control button so size, padding and vertical alignment match exactly.
    const btn = sizeBtn ? sizeBtn.cloneNode(false) : document.createElement('button');
    for (const attr of Array.from(btn.attributes)) btn.removeAttribute(attr.name);
    btn.type = 'button';
    btn.className = 'ytp-button ' + BTN_CLASS;
    btn.innerHTML = ICON;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    if (sizeBtn && sizeBtn.parentElement) sizeBtn.parentElement.insertBefore(btn, sizeBtn);
    else controls.appendChild(btn);
    syncButton();
  }

  // YouTube rebuilds the control bar on navigation and ad transitions; re-add the button when it vanishes.
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensureButton();
    });
  }).observe(root, { childList: true, subtree: true });

  // Leave full-window mode when moving to another video.
  document.addEventListener('yt-navigate-start', () => {
    if (isActive()) setActive(false);
  });
  document.addEventListener('yt-navigate-finish', ensureButton);

  document.addEventListener(
    'keydown',
    (e) => {
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'Escape' && isActive()) {
        setActive(false);
      } else if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyT') {
        e.preventDefault();
        toggle();
      }
    },
    true
  );

  ensureButton();
})();
