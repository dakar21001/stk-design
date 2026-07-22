/* ============================================================
   ST.K DESIGN — MOBILE NAVIGATION
   Спільний модуль для всіх сторінок.
   Патерн: fullscreen overlay + focus trap + a11y.
   ============================================================ */
(() => {
  'use strict';

  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const DESKTOP = window.matchMedia('(min-width: 861px)');
  let lastFocused = null;

  const focusables = () =>
    [...menu.querySelectorAll('a[href], button:not([disabled])')]
      .filter(el => el.offsetParent !== null);

  /* Компенсація ширини скролбару, щоб layout не «стрибав»
     при overflow:hidden на body (актуально для desktop-браузерів). */
  const scrollbarW = () => window.innerWidth - document.documentElement.clientWidth;

  const open = () => {
    lastFocused = document.activeElement;
    document.documentElement.style.setProperty('--sbw', scrollbarW() + 'px');

    menu.hidden = false;
    // Подвійний rAF: гарантує, що браузер зафіксує початковий стан
    // до застосування класу — інакше transition не спрацює.
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));

    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрити меню');
    document.body.classList.add('nav-open');

    focusables()[0]?.focus({ preventScroll: true });
  };

  const close = ({ restoreFocus = true } = {}) => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Відкрити меню');
    document.body.classList.remove('nav-open');

    const done = () => { if (!menu.classList.contains('is-open')) menu.hidden = true; };
    menu.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 700); // fallback, якщо transitionend не прийде

    /* Фолбек: якщо тригер не отримав фокус (напр. Safari не фокусує
       <button> по кліку), повертаємо фокус на бургер, а не на <body> —
       інакше клавіатурний користувач «падає» на початок сторінки. */
    if (restoreFocus) {
      const target = (lastFocused && lastFocused !== document.body) ? lastFocused : burger;
      target.focus({ preventScroll: true });
    }
  };

  const isOpen = () => burger.getAttribute('aria-expanded') === 'true';

  burger.addEventListener('click', () => (isOpen() ? close() : open()));

  /* Клік по пункту — закриваємо. Критично для якірних посилань:
     інакше overlay лишиться поверх секції, до якої ми скролимо. */
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) close({ restoreFocus: false });
  });

  /* Клавіатура: Esc + focus trap (WCAG 2.1.2 No Keyboard Trap /
     ARIA Authoring Practices для modal dialog). */
  document.addEventListener('keydown', e => {
    if (menu.hidden) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); return; }

    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last  = f[f.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* Перехід на desktop-брейкпойнт — скидаємо стан,
     щоб не лишити body заблокованим. */
  const onBreakpoint = e => { if (e.matches && !menu.hidden) close({ restoreFocus: false }); };
  DESKTOP.addEventListener?.('change', onBreakpoint);

  /* bfcache: при поверненні «назад» стан меню має бути чистим. */
  window.addEventListener('pageshow', e => {
    if (e.persisted && !menu.hidden) close({ restoreFocus: false });
  });
})();
