/* ============================================================
   ST.K DESIGN - посадкова /start
   1) поява секцій  2) заголовок під рекламну групу (?service=)
   3) живий вибір послуги → заявка  4) відгук із Sanity
   5) валідація й відправка форми на воркер stk-contact
   ============================================================ */
(() => {
  'use strict';

  /* ---------- 1. Поява при вході в екран (один раз) ---------- */
  const targets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
    // запобіжник: нічого не лишається прихованим, якщо спостерігач не спрацював
    window.addEventListener('load', () => setTimeout(() => {
      targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
    }, 2500));
  } else {
    targets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- 2. Послуги: тексти під кожну рекламну групу ---------- */
  const SERVICES = {
    sites:   { h: ['Сайт', 'під ключ.'],     lead: 'Корпоративні сайти, що швидко вантажаться й приводять заявки. Дизайн, розробка й запуск однією командою.', name: 'Корпоративний сайт', of: 'сайту' },
    landing: { h: ['Лендинг', 'під ключ.'],  lead: 'Сторінка під одну дію: рекламу, запуск чи збір заявок. Лендинг DayDrive підняв конверсію на 42%.', name: 'Лендинг', of: 'лендингу' },
    shop:    { h: ['Магазин', 'під ключ.'],  lead: 'Інтернет-магазини з простим шляхом до покупки: каталог, кошик, оплата й запуск однією командою.', name: 'Інтернет-магазин', of: 'магазину' },
    apps:    { h: ['Додаток', 'під ключ.'],  lead: 'Мобільні застосунки для iOS і Android: від прототипу до публікації в App Store і Google Play.', name: 'Мобільний застосунок', of: 'застосунку' },
    web:     { h: ['Сервіс', 'під ключ.'],   lead: 'Веб-сервіси, кабінети й панелі керування з чистою архітектурою. Від дизайну до запуску.', name: 'Веб-сервіс', of: 'веб-сервісу' },
    design:  { h: ['UX/UI', 'дизайн.'],      lead: 'Дослідження, прототипи й дизайн-система, яку легко передати в розробку. Або одразу розробимо самі.', name: 'UX/UI дизайн', of: 'дизайну' },
    mvp:     { h: ['MVP', 'під ключ.'],      lead: 'Перша версія продукту, щоб перевірити ідею на реальних людях до великих вкладень.', name: 'MVP', of: 'MVP' },
    brand:   { h: ['Брендинг', 'з нуля.'],   lead: 'Логотип і айдентика, що однаково працюють на сайті, в застосунку й на папері.', name: 'Брендинг', of: 'брендингу' },
  };

  const params = new URLSearchParams(location.search);
  const fromAd = SERVICES[params.get('service')] ? params.get('service') : null;

  if (fromAd) {
    const s = SERVICES[fromAd];
    document.getElementById('heroLine1').textContent = s.h[0];
    document.getElementById('heroLine2').textContent = s.h[1];
    document.getElementById('heroLead').textContent = s.lead;
  }

  /* джерело заявки: сторінка + сервіс + utm, щоб у Telegram було видно, з якої реклами лід */
  const pageField = document.getElementById('pageField');
  const src = ['lp:/start', fromAd && 'service=' + fromAd,
    ...['utm_source', 'utm_campaign', 'utm_term'].map((k) => params.get(k) && `${k.replace('utm_', '')}=${params.get(k)}`)]
    .filter(Boolean).join(' · ');
  if (pageField) pageField.value = src.slice(0, 200);

  /* ---------- 3. Живий вибір: рядок списку ↔ чип у заявці ---------- */
  const svcButtons = [...document.querySelectorAll('.svc__btn')];
  const chips = [...document.querySelectorAll('#typeChips input')];
  const status = document.getElementById('svcStatus');

  const select = (key, { announce = false } = {}) => {
    svcButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.service === key)));
    chips.forEach((c) => { c.checked = c.dataset.service === key; });
    const s = SERVICES[key];
    if (announce && status) {
      status.innerHTML = s
        ? `«${s.name}» додано в заявку. <a class="link-plain" href="#contact">Перейти до заявки</a>`
        : '';
    }
  };

  svcButtons.forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') === 'true';
    select(on ? null : b.dataset.service, { announce: true });
  }));
  chips.forEach((c) => c.addEventListener('change', () => { if (c.checked) select(c.dataset.service); }));
  if (fromAd) select(fromAd);

  /* ---------- 4. Повний текст відгуку з Sanity (є статичний запас) ---------- */
  const open = document.getElementById('letterOpen');
  const text = document.getElementById('letterText');
  if (open && text && 'fetch' in window) {
    const q = encodeURIComponent('*[_type=="caseStudy" && client=="DayDrive"][0].testimonial.text');
    fetch(`https://aau1ytum.apicdn.sanity.io/v2024-01-01/data/query/production?query=${q}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const full = d && typeof d.result === 'string' ? d.result.trim() : '';
        if (!full || !full.startsWith(open.textContent.trim())) return; // показуємо лише справжній текст цього відгуку
        const rest = full.slice(open.textContent.trim().length).trim();
        if (!rest) return;
        const paras = rest.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        text.replaceChildren(...paras.map((p) => Object.assign(document.createElement('p'), { textContent: p })));
      })
      .catch(() => { /* лишається статичний уривок */ });
  }

  /* ---------- 5. Форма заявки ---------- */
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  const ok = document.getElementById('statusOk');
  const err = document.getElementById('statusErr');
  const isPhone = (v) => /^[+\d][\d\s()\-]{6,}$/.test(v);

  const check = (input) => {
    const field = input.closest('[data-field]');
    const v = input.value.trim();
    let good = !input.required || !!v;
    if (input.name === 'phone' && v) good = isPhone(v);
    field?.classList.toggle('is-invalid', !good);
    input.setAttribute('aria-invalid', String(!good));
    return good;
  };

  form.querySelectorAll('input[required]').forEach((el) => {
    el.addEventListener('blur', () => { if (el.value.trim()) check(el); });
    el.addEventListener('input', () => { if (el.closest('.is-invalid')) check(el); });
  });

  let started = false;
  form.addEventListener('input', () => {
    if (started) return;
    started = true;
    window.stkAnalytics?.track?.('form_start');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    ok.hidden = true; err.hidden = true;

    const required = [...form.querySelectorAll('input[required]')];
    const bad = required.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }
    if (form.botcheck?.checked) return;

    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error('bad response');
      try { window.stkAnalytics?.trackLead?.(); } catch (_) { /* аналітика не ламає форму */ }
      form.reset();
      select(null);
      ok.hidden = false;
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (_) {
      window.stkAnalytics?.track?.('form_error');
      err.hidden = false;
    } finally {
      submitBtn.removeAttribute('aria-busy');
      submitBtn.disabled = false;
    }
  });
})();
