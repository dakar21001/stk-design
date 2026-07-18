/* ============================================================
   ST.K DESIGN — CASES DATA MODULE (спільне джерело)
   ------------------------------------------------------------
   Це ЄДИНЕ джерело даних портфоліо. Підключається і на головній
   (index.html), і на сторінці проєктів (projects.html).

   ІНТЕГРАЦІЯ АДМІН-ПАНЕЛІ:
   Коли з'явиться бекенд — замінити константу STK_CASES на запит:

       window.STK.loadCases = async () =>
         (await fetch('/api/cases')).json();

   Схема одного кейса = майбутня таблиця в БД:
     id        — унікальний ідентифікатор (PK)
     slug      — URL-частина (/work/<slug>), унікальна
     category  — рядок "Напрям · Тип" (використовується у фільтрі)
     filters   — масив тегів-категорій для фільтрації на сторінці
     title, desc, year
     cover     — шлях до реального зображення (WebP/AVIF); порожньо → плейсхолдер
     coverAlt  — alt-текст (a11y + SEO)
     tags      — технології
     metrics   — [{num, label}] результати
     featured  — true → показувати на головній сторінці
     hue       — відтінок плейсхолдера (0–360), поки нема реального фото
   ============================================================ */
(function () {
  const STK_CASES = [
    {
      id: 'nrt-01', slug: 'northwind-banking',
      category: 'Fintech · Mobile App',
      filters: ['Mobile Apps', 'UX/UI'],
      title: 'Northwind Banking',
      desc: 'Мобільний банк із нуля: онбординг за 3 хвилини, платежі в один тап і дизайн-система на 200+ компонентів.',
      cover: '', coverAlt: 'Превʼю застосунку Northwind Banking',
      year: 2025,
      tags: ['iOS', 'Android', 'Design System', 'React Native'],
      metrics: [
        { num: '+38%', label: 'утримання за 90 днів' },
        { num: '4.9', label: 'рейтинг у сторах' }
      ],
      featured: true, hue: 226,
      // — Розширені поля для сторінки кейса (усі опціональні) —
      subtitle: 'Необанк, який любить онбордити за три хвилини',
      client: 'Northwind Financial',
      role: ['Product Discovery', 'UX/UI Design', 'Mobile Development'],
      duration: '7 місяців',
      liveUrl: '',
      overview: {
        challenge: 'Northwind виходив на переповнений ринок необанків. Треба було не просто «ще один банк у телефоні», а продукт, який проходить онбординг швидше за конкурентів і не лякає складністю — при цьому з повним набором фінансових функцій під капотом.',
        solution: 'Ми провели Discovery, зібрали дизайн-систему на 200+ компонентів і побудували застосунок на React Native, щоб паралельно закрити iOS та Android. Онбординг скоротили до трьох екранів, платежі звели до одного тапу, а складні операції сховали за прогресивним розкриттям.'
      },
      results: [
        { num: '+38%', label: 'утримання за 90 днів', note: 'проти галузевого бенчмарку для необанків' },
        { num: '4.9', label: 'рейтинг у App Store та Google Play', note: 'понад 12 000 оцінок за перший рік' },
        { num: '3 хв', label: 'середній час онбордингу', note: 'від встановлення до першої операції' }
      ],
      gallery: [
        { hue: 226, alt: 'Екран онбордингу Northwind Banking' },
        { hue: 232, alt: 'Головний екран із балансом і швидкими діями' },
        { hue: 218, alt: 'Екран платежу в один тап' }
      ],
      testimonial: {
        text: 'ST.K зібрали наш застосунок швидше, ніж ми планували лише дизайн. Рідкісний випадок, коли підрядник думає про продукт, а не про години.',
        name: 'Ірина Коваль', role: 'Product Lead, Northwind'
      }
    },
    {
      id: 'orb-02', slug: 'orbital-analytics',
      category: 'SaaS · Web Application',
      filters: ['Web Apps', 'UX/UI'],
      title: 'Orbital Analytics',
      desc: 'B2B-платформа аналітики: складні дашборди, які лишаються зрозумілими, і рендер великих даних без лагів.',
      cover: '', coverAlt: 'Превʼю платформи Orbital Analytics',
      year: 2024,
      tags: ['Next.js', 'TypeScript', 'D3', 'Node'],
      metrics: [
        { num: '2.1s', label: 'до інтерактиву' },
        { num: '×3', label: 'швидше рішення' }
      ],
      featured: true, hue: 265
    },
    {
      id: 'sft-03', slug: 'sifted-store',
      category: 'E-commerce · Branding',
      filters: ['E-commerce', 'Branding'],
      title: 'Sifted Store',
      desc: 'Ребрендинг і headless-магазин для нішевої кави: новий чекаут скоротив шлях до покупки вдвічі.',
      cover: '', coverAlt: 'Превʼю магазину Sifted Store',
      year: 2025,
      tags: ['Shopify', 'Headless', 'Identity', 'Motion'],
      metrics: [
        { num: '+52%', label: 'конверсія чекауту' },
        { num: '−40%', label: 'відмов у кошику' }
      ],
      featured: true, hue: 200
    },
    {
      id: 'mer-04', slug: 'meridian-health',
      category: 'HealthTech · Web App',
      filters: ['Web Apps', 'UX/UI'],
      title: 'Meridian Health',
      desc: 'Платформа телемедицини: запис до лікаря, відеовізити та історія хвороби в одному захищеному просторі.',
      cover: '', coverAlt: 'Превʼю платформи Meridian Health',
      year: 2024,
      tags: ['React', 'Node', 'WebRTC', 'HIPAA'],
      metrics: [
        { num: '−45%', label: 'час на запис' },
        { num: '60k', label: 'візитів на місяць' }
      ],
      featured: false, hue: 168
    },
    {
      id: 'vlt-05', slug: 'volt-mobility',
      category: 'Mobility · Mobile App',
      filters: ['Mobile Apps', 'Branding'],
      title: 'Volt Mobility',
      desc: 'Застосунок кікшерингу з нуля: мапа в реальному часі, оплата в один тап і айдентика, що впізнається на вулиці.',
      cover: '', coverAlt: 'Превʼю застосунку Volt Mobility',
      year: 2023,
      tags: ['Flutter', 'Maps', 'Identity', 'Payments'],
      metrics: [
        { num: '120k', label: 'завантажень' },
        { num: '4.8', label: 'рейтинг у сторах' }
      ],
      featured: false, hue: 32
    },
    {
      id: 'atl-06', slug: 'atlas-corporate',
      category: 'Corporate · Website',
      filters: ['Websites', 'UX/UI'],
      title: 'Atlas Group',
      desc: 'Іміджевий сайт міжнародного холдингу: миттєве завантаження, багатомовність і бездоганний Lighthouse.',
      cover: '', coverAlt: 'Превʼю сайту Atlas Group',
      year: 2025,
      tags: ['Next.js', 'CMS', 'i18n', 'SEO'],
      metrics: [
        { num: '100', label: 'бал Lighthouse' },
        { num: '0.8s', label: 'до інтерактиву' }
      ],
      featured: false, hue: 210
    }
  ];

  // Якісний SVG-плейсхолдер: градієнт бренду + назва + сітка.
  const placeholderSVG = (c) => {
    const h = c.hue;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='800' height='600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='hsl(${h} 70% 58%)'/>
          <stop offset='1' stop-color='hsl(${h + 18} 65% 42%)'/>
        </linearGradient>
        <pattern id='dots' width='28' height='28' patternUnits='userSpaceOnUse'>
          <circle cx='2' cy='2' r='1.4' fill='rgba(255,255,255,0.22)'/>
        </pattern>
      </defs>
      <rect width='800' height='600' fill='url(#g)'/>
      <rect width='800' height='600' fill='url(#dots)'/>
      <text x='48' y='540' font-family='Space Grotesk, sans-serif' font-size='40' font-weight='600' fill='rgba(255,255,255,0.95)' letter-spacing='-1'>${c.title}</text>
      <text x='48' y='72' font-family='Inter Tight, sans-serif' font-size='18' fill='rgba(255,255,255,0.75)' letter-spacing='2'>ST.K · ${c.year}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  const mediaTag = (c) => {
    const src = c.cover ? c.cover : placeholderSVG(c);
    return `<img src="${src}" alt="${c.coverAlt}" loading="lazy" decoding="async" width="800" height="600">`;
  };

  // Рендер картки для ГОЛОВНОЇ (zigzag, крупні кейси).
  const renderCaseLarge = (c, i) => {
    const idx = String(i + 1).padStart(2, '0');
    const metrics = c.metrics.map(m =>
      `<div><div class="case__metric-num">${m.num}</div><div class="case__metric-label">${m.label}</div></div>`
    ).join('');
    const tags = c.tags.map(t => `<span class="case__tag">${t}</span>`).join('');
    return `
      <article class="case" role="listitem" data-reveal>
        <div class="case__media">
          <span class="case__index">${idx}</span>
          ${mediaTag(c)}
          <a class="case__view" href="case.html?slug=${c.slug}" aria-label="Відкрити кейс ${c.title}">
            Дивитися кейс
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
          </a>
        </div>
        <div class="case__body">
          <div class="case__cat">${c.category}</div>
          <h3 class="case__title">${c.title}</h3>
          <p class="case__desc">${c.desc}</p>
          <div class="case__metrics">${metrics}</div>
          <div class="case__tags">${tags}</div>
        </div>
      </article>`;
  };

  // Рендер картки для СІТКИ на сторінці проєктів (компактніша).
  const renderCaseGrid = (c) => {
    const metrics = c.metrics.slice(0, 2).map(m =>
      `<div><span class="pcard__metric-num">${m.num}</span> <span class="pcard__metric-label">${m.label}</span></div>`
    ).join('');
    return `
      <article class="pcard" role="listitem" data-reveal data-filters="${c.filters.join('|')}">
        <a class="pcard__link" href="case.html?slug=${c.slug}" aria-label="Відкрити кейс ${c.title}">
          <div class="pcard__media">
            ${mediaTag(c)}
            <span class="pcard__year">${c.year}</span>
          </div>
          <div class="pcard__body">
            <div class="pcard__cat">${c.category}</div>
            <h3 class="pcard__title">${c.title}</h3>
            <p class="pcard__desc">${c.desc}</p>
            <div class="pcard__metrics">${metrics}</div>
          </div>
        </a>
      </article>`;
  };

  // Унікальні категорії-фільтри з самих даних (нові з адмінки з'являться самі).
  const getFilters = () => {
    const set = new Set();
    STK_CASES.forEach(c => c.filters.forEach(f => set.add(f)));
    return ['Усі', ...Array.from(set)];
  };

  // Знайти кейс за slug (для сторінки кейса).
  const getBySlug = (slug) => STK_CASES.find(c => c.slug === slug) || null;

  // Наступний кейс у списку (циклічно) — для навігації внизу сторінки кейса.
  const getNext = (slug) => {
    const i = STK_CASES.findIndex(c => c.slug === slug);
    if (i === -1) return null;
    return STK_CASES[(i + 1) % STK_CASES.length];
  };

  // Плейсхолдер для галереї (вертикальний/квадратний варіант).
  const galleryPlaceholder = (hue, title) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 700' width='900' height='700'>
      <defs>
        <linearGradient id='gg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='hsl(${hue} 68% 56%)'/>
          <stop offset='1' stop-color='hsl(${hue + 16} 62% 40%)'/>
        </linearGradient>
        <pattern id='gd' width='30' height='30' patternUnits='userSpaceOnUse'>
          <circle cx='2' cy='2' r='1.3' fill='rgba(255,255,255,0.2)'/>
        </pattern>
      </defs>
      <rect width='900' height='700' fill='url(#gg)'/>
      <rect width='900' height='700' fill='url(#gd)'/>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  // Повний рендер сторінки кейса. Усі розширені поля опціональні —
  // якщо адмін не заповнив блок, він просто не рендериться (сторінка не ламається).
  const renderCasePage = (c) => {
    const esc = s => String(s == null ? '' : s);
    const cover = c.cover
      ? `<img src="${c.cover}" alt="${esc(c.coverAlt)}" width="1200" height="750" fetchpriority="high">`
      : `<img src="${placeholderSVG(c)}" alt="${esc(c.coverAlt)}" width="1200" height="750" fetchpriority="high">`;

    const facts = [
      c.client   ? `<div class="cp__fact"><dt>Клієнт</dt><dd>${esc(c.client)}</dd></div>` : '',
      c.year     ? `<div class="cp__fact"><dt>Рік</dt><dd>${esc(c.year)}</dd></div>` : '',
      c.duration ? `<div class="cp__fact"><dt>Тривалість</dt><dd>${esc(c.duration)}</dd></div>` : '',
      (c.role && c.role.length) ? `<div class="cp__fact"><dt>Роль</dt><dd>${c.role.join(', ')}</dd></div>` : ''
    ].join('');

    const overview = c.overview ? `
      <section class="cp__overview" data-reveal>
        <div class="cp__ov-col">
          <h2 class="cp__h2">Завдання</h2>
          <p>${esc(c.overview.challenge)}</p>
        </div>
        <div class="cp__ov-col">
          <h2 class="cp__h2">Рішення</h2>
          <p>${esc(c.overview.solution)}</p>
        </div>
      </section>` : '';

    const results = (c.results && c.results.length) ? `
      <section class="cp__results" data-reveal>
        <h2 class="cp__h2">Результати</h2>
        <div class="cp__results-grid">
          ${c.results.map(r => `
            <div class="cp__result">
              <div class="cp__result-num">${esc(r.num)}</div>
              <div class="cp__result-label">${esc(r.label)}</div>
              ${r.note ? `<p class="cp__result-note">${esc(r.note)}</p>` : ''}
            </div>`).join('')}
        </div>
      </section>` : '';

    const gallery = (c.gallery && c.gallery.length) ? `
      <section class="cp__gallery">
        ${c.gallery.map(g => `
          <figure class="cp__shot" data-reveal>
            <img src="${g.src ? g.src : galleryPlaceholder(g.hue != null ? g.hue : c.hue, c.title)}"
                 alt="${esc(g.alt)}" loading="lazy" decoding="async" width="900" height="700">
          </figure>`).join('')}
      </section>` : '';

    const testimonial = c.testimonial ? `
      <section class="cp__quote" data-reveal>
        <div class="quote__mark" aria-hidden="true">“</div>
        <blockquote class="cp__quote-text">${esc(c.testimonial.text)}</blockquote>
        <figcaption class="cp__quote-foot">
          <span class="cp__quote-name">${esc(c.testimonial.name)}</span>
          <span class="cp__quote-role">${esc(c.testimonial.role)}</span>
        </figcaption>
      </section>` : '';

    const liveBtn = c.liveUrl
      ? `<a href="${esc(c.liveUrl)}" class="btn btn--ghost" target="_blank" rel="noopener">Дивитися наживо<span class="btn__arrow" aria-hidden="true">↗</span></a>`
      : '';

    const tags = (c.tags || []).map(t => `<span class="case__tag">${esc(t)}</span>`).join('');

    return `
      <section class="cp__hero wrap">
        <nav class="breadcrumb" aria-label="Хлібні крихти">
          <a href="index.html">Головна</a> / <a href="projects.html">Проєкти</a> / <span>${esc(c.title)}</span>
        </nav>
        <div class="cp__cat">${esc(c.category)}</div>
        <h1 class="cp__title">${esc(c.title)}</h1>
        ${c.subtitle ? `<p class="cp__subtitle">${esc(c.subtitle)}</p>` : ''}
        ${liveBtn ? `<div class="cp__hero-actions">${liveBtn}</div>` : ''}
      </section>

      <section class="cp__cover wrap" data-reveal>
        <div class="cp__cover-media">${cover}</div>
      </section>

      ${facts ? `<section class="cp__facts wrap" data-reveal><dl class="cp__facts-grid">${facts}</dl>${tags ? `<div class="cp__tags case__tags">${tags}</div>` : ''}</section>` : ''}

      <div class="wrap">
        ${overview}
        ${results}
      </div>

      ${gallery ? `<div class="wrap">${gallery}</div>` : ''}

      ${testimonial ? `<div class="wrap">${testimonial}</div>` : ''}
    `;
  };

  // Публічний інтерфейс. Адмінка перевизначає loadCases на fetch.
  window.STK = {
    cases: STK_CASES,
    featured: () => STK_CASES.filter(c => c.featured),
    loadCases: async () => STK_CASES, // ← замінити на fetch('/api/cases')
    getFilters,
    getBySlug,
    getNext,
    placeholderSVG,
    renderCaseLarge,
    renderCaseGrid,
    renderCasePage
  };
})();
