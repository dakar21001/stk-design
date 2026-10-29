/* ============================================================
   ST.K DESIGN - посадкова /start
   Анімації (поява, лічильники, паралакс, магнітна кнопка,
   світло на картках, таймлайн), вибір послуги, відгуки з Sanity,
   акордеон FAQ, форма заявки.
   ============================================================ */
(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Заголовок hero: розбиваємо на слова для каскадної появи ---------- */
  const title = document.querySelector('[data-words]');
  const splitWords = (el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--wi:${i}">${w}</span></span>`).join(' ');
  };

  /* ---------- Тексти під рекламні групи (?service=) ---------- */
  const SERVICES = {
    sites:   { h: 'Корпоративні сайти під ключ', lead: 'Сайт, що швидко вантажиться, ранжується в пошуку й приводить заявки. Дизайн, розробка й запуск однією командою.', name: 'Корпоративний сайт' },
    landing: { h: 'Лендинги, що приводять заявки', lead: 'Сторінка під одну дію: рекламу, запуск чи збір заявок. Лендинг DayDrive підняв конверсію на 42%.', name: 'Лендинг' },
    shop:    { h: 'Інтернет-магазини під ключ', lead: 'Каталог, кошик і оплата з простим шляхом до покупки. Від дизайну до запуску однією командою.', name: 'Інтернет-магазин' },
    apps:    { h: 'Мобільні застосунки під ключ', lead: 'iOS і Android: від прототипу до публікації в App Store і Google Play. Наш застосунок має рейтинг 4.8.', name: 'Мобільний застосунок' },
    web:     { h: 'Веб-сервіси під ключ', lead: 'Кабінети, панелі керування й внутрішні системи з чистою архітектурою. Від дизайну до запуску.', name: 'Веб-сервіс' },
    design:  { h: 'UX/UI дизайн продуктів', lead: 'Дослідження, прототипи й дизайн-система, яку легко передати в розробку. Або одразу розробимо самі.', name: 'UX/UI дизайн' },
    mvp:     { h: 'MVP для стартапу під ключ', lead: 'Перша версія продукту, щоб перевірити ідею на реальних людях до великих вкладень. Зазвичай 6-10 тижнів.', name: 'MVP' },
    brand:   { h: 'Брендинг і айдентика з нуля', lead: 'Логотип і айдентика, що однаково працюють на сайті, в застосунку й на папері.', name: 'Брендинг' },
  };
  const params = new URLSearchParams(location.search);
  const fromAd = Object.hasOwn(SERVICES, params.get('service') || '') ? params.get('service') : null;
  if (fromAd && title) {
    title.textContent = SERVICES[fromAd].h;
    const lead = document.getElementById('heroLead');
    if (lead) lead.textContent = SERVICES[fromAd].lead;
  }
  if (title) splitWords(title);

  /* джерело заявки для Telegram: сторінка, послуга, utm */
  const pageField = document.getElementById('pageField');
  if (pageField) {
    pageField.value = ['lp:/start', fromAd && `service=${fromAd}`,
      ...['utm_source', 'utm_campaign', 'utm_term'].map((k) => params.get(k) && `${k.slice(4)}=${params.get(k)}`)]
      .filter(Boolean).join(' · ').slice(0, 200);
  }

  /* ---------- Шапка: фон після першого екрана (без scroll-listener) ---------- */
  const bar = document.getElementById('bar');
  const hero = document.querySelector('.hero');
  if (bar && hero && 'IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none';
    hero.prepend(sentinel);
    new IntersectionObserver(([e]) => bar.classList.toggle('is-stuck', !e.isIntersecting)).observe(sentinel);
  }

  /* ---------- Лічильники ---------- */
  const fmt = (v, d) => (d ? v.toFixed(d) : Math.round(v).toLocaleString('uk-UA').replace(/\s/g, ' '));
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduce || !isFinite(end)) { el.textContent = fmt(end, dec); return; }
    const dur = 1400; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * eased, dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = fmt(0, dec);
    requestAnimationFrame(tick);
  };

  /* ---------- Поява при прокрутці (один раз) ---------- */
  const show = (el) => {
    el.classList.add('is-in');
    el.querySelectorAll('[data-count]').forEach(countUp);
  };
  const revealTargets = [...document.querySelectorAll('[data-reveal], [data-timeline], [data-group]')];
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
    // лічильники в hero стартують після появи блоку
    setTimeout(() => document.querySelectorAll('.stats [data-count]').forEach(countUp), 800);
    // запобіжник: нічого не лишається прихованим
    window.addEventListener('load', () => setTimeout(() => revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && !el.classList.contains('is-in')) show(el);
    }), 2500));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Паралакс hero за курсором ---------- */
  const visual = document.querySelector('[data-parallax]');
  if (visual && finePointer && !reduce) {
    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        visual.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        visual.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        raf = 0;
      });
    });
    hero.addEventListener('pointerleave', () => { visual.style.setProperty('--mx', 0); visual.style.setProperty('--my', 0); });
  }

  /* ---------- Магнітна кнопка ---------- */
  if (finePointer && !reduce) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mag-x', `${(e.clientX - r.left - r.width / 2) * 0.2}px`);
        btn.style.setProperty('--mag-y', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--mag-x', '0px'); btn.style.setProperty('--mag-y', '0px'); });
    });
  }

  /* ---------- Світло на картках послуг ---------- */
  if (finePointer) {
    document.querySelectorAll('.svc').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Вибір послуги ↔ чип у заявці ---------- */
  const svcButtons = [...document.querySelectorAll('.svc')];
  const chips = [...document.querySelectorAll('#typeChips input')];
  const status = document.getElementById('svcStatus');
  const select = (key, announce = false) => {
    svcButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.service === key)));
    chips.forEach((c) => { c.checked = c.dataset.service === key; });
    if (announce && status) {
      const s = SERVICES[key];
      status.innerHTML = s ? `«${s.name}» додано в заявку. <a href="#contact">Перейти до заявки →</a>` : '';
    }
  };
  svcButtons.forEach((b) => b.addEventListener('click', () => {
    select(b.getAttribute('aria-pressed') === 'true' ? null : b.dataset.service, true);
  }));
  chips.forEach((c) => c.addEventListener('change', () => { if (c.checked) select(c.dataset.service); }));
  if (fromAd) select(fromAd);

  /* ---------- Відгуки: повний текст із Sanity ---------- */
  const quotes = [...document.querySelectorAll('.quote[data-client]')];
  if (quotes.length) {
    const q = encodeURIComponent('*[_type=="caseStudy" && defined(testimonial.text)]{client,"text":testimonial.text}');
    fetch(`https://aau1ytum.apicdn.sanity.io/v2024-01-01/data/query/production?query=${q}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ result }) => {
        quotes.forEach((card) => {
          const hit = (result || []).find((x) => x.client === card.dataset.client);
          const box = card.querySelector('[data-quote]');
          if (!hit || !box) { if (box?.classList.contains('quote__text--loading')) card.remove(); return; }
          // коротко: перші два-три речення, щоб картки були співмірні
          const sentences = hit.text.trim().match(/[^.!?]+[.!?]+/g) || [hit.text.trim()];
          let out = '';
          for (const s of sentences) { if ((out + s).length > 260 && out) break; out += s; }
          box.classList.remove('quote__text--loading');
          box.textContent = out.trim();
        });
      })
      .catch(() => document.querySelectorAll('.quote__text--loading').forEach((b) => b.closest('.quote')?.remove()));
  }

  /* ---------- FAQ: акордеон ---------- */
  document.querySelectorAll('.acc__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.closest('.acc__item').classList.toggle('is-open', !open);
    });
  });

  /* ---------- Форма заявки ---------- */
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  const label = submitBtn.querySelector('.btn__label');
  const ok = document.getElementById('statusOk');
  const err = document.getElementById('statusErr');
  const isPhone = (v) => /^[+\d][\d\s()\-]{6,}$/.test(v);

  const check = (input) => {
    const field = input.closest('[data-field]');
    const v = input.value.trim();
    let good = !input.required || !!v;
    if (input.name === 'phone' && v) good = isPhone(v);
    if (field) { field.classList.remove('is-invalid'); void field.offsetWidth; field.classList.toggle('is-invalid', !good); }
    input.setAttribute('aria-invalid', String(!good));
    return good;
  };
  form.querySelectorAll('input[required]').forEach((el) => {
    el.addEventListener('blur', () => { if (el.value.trim()) check(el); });
    el.addEventListener('input', () => { if (el.closest('.is-invalid')) check(el); });
  });

  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; window.stkAnalytics?.track?.('form_start'); } });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    ok.hidden = true; err.hidden = true;
    const bad = [...form.querySelectorAll('input[required]')].filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }
    if (form.botcheck?.checked) return;

    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;
    label.textContent = 'Надсилаємо';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error('bad response');
      try { window.stkAnalytics?.trackLead?.(); } catch (_) { /* аналітика не ламає форму */ }
      form.reset();
      select(null);
      ok.hidden = false;
    } catch (_) {
      window.stkAnalytics?.track?.('form_error');
      err.hidden = false;
    } finally {
      submitBtn.removeAttribute('aria-busy');
      submitBtn.disabled = false;
      label.textContent = 'Розрахувати вартість';
    }
  });
})();
