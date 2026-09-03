/* ============================================================
   ST.K DESIGN — CASES DATA MODULE (shared source)
   ------------------------------------------------------------
   This is the SINGLE source of portfolio data. Used both on the home
   page (index.html) and on the projects page (projects.html).

   ADMIN PANEL INTEGRATION:
   When a backend is added — replace the STK_CASES constant with a request:

       window.STK.loadCases = async () =>
         (await fetch('/api/cases')).json();

   Schema of one case = future database table:
     id        — unique identifier (PK)
     slug      — URL part (/work/<slug>), unique
     category  — string "Direction · Type" (used in the filter)
     filters   — array of category tags for on-page filtering
     title, desc, year
     cover     — path to the real image (WebP/AVIF); empty → placeholder
     coverAlt  — alt text (a11y + SEO)
     tags      — technologies
     metrics   — [{num, label}] results
     featured  — true → show on the home page
     hue       — placeholder hue (0–360) until a real photo exists
   ============================================================ */
(function () {
  const STK_CASES = [
    {
      id: 'nrt-01', slug: 'northwind-banking',
      category: 'Fintech · Mobile App',
      filters: ['Mobile Apps', 'UX/UI'],
      title: 'Northwind Banking',
      desc: 'A mobile bank from scratch: 3-minute onboarding, one-tap payments and a design system of 200+ components.',
      cover: '', coverAlt: 'Preview of the Northwind Banking app',
      year: 2025,
      tags: ['iOS', 'Android', 'Design System', 'React Native'],
      metrics: [
        { num: '+38%', label: '90-day retention' },
        { num: '4.9', label: 'store rating' }
      ],
      featured: true, hue: 226,
      // — Extended fields for the case page (all optional) —
      subtitle: 'A neobank that loves to onboard in three minutes',
      client: 'Northwind Financial',
      role: ['Product Discovery', 'UX/UI Design', 'Mobile Development'],
      duration: '7 months',
      liveUrl: '',
      overview: {
        challenge: 'Northwind was entering a crowded neobank market. It needed to be not just “another bank in your phone”, but a product that onboards faster than competitors and doesn’t intimidate with complexity — while packing a full set of financial features under the hood.',
        solution: 'We ran Discovery, built a design system of 200+ components and shipped the app on React Native to cover iOS and Android in parallel. We cut onboarding to three screens, reduced payments to a single tap, and hid complex operations behind progressive disclosure.'
      },
      results: [
        { num: '+38%', label: '90-day retention', note: 'against the neobank industry benchmark' },
        { num: '4.9', label: 'rating on App Store and Google Play', note: 'over 12,000 reviews in the first year' },
        { num: '3 min', label: 'average onboarding time', note: 'from install to first transaction' }
      ],
      gallery: [
        { hue: 226, alt: 'Northwind Banking onboarding screen' },
        { hue: 232, alt: 'Home screen with balance and quick actions' },
        { hue: 218, alt: 'One-tap payment screen' }
      ],
      testimonial: {
        text: 'ST.K built our app faster than we’d planned just for the design. A rare case where a contractor thinks about the product, not the hours.',
        name: 'Iryna Koval', role: 'Product Lead, Northwind'
      }
    },
    {
      id: 'orb-02', slug: 'orbital-analytics',
      category: 'SaaS · Web Application',
      filters: ['Web Apps', 'UX/UI'],
      title: 'Orbital Analytics',
      desc: 'A B2B analytics platform: complex dashboards that stay readable, and large-data rendering with no lag.',
      cover: '', coverAlt: 'Preview of the Orbital Analytics platform',
      year: 2024,
      tags: ['Next.js', 'TypeScript', 'D3', 'Node'],
      metrics: [
        { num: '2.1s', label: 'to interactive' },
        { num: '×3', label: 'faster decisions' }
      ],
      featured: true, hue: 265
    },
    {
      id: 'sft-03', slug: 'sifted-store',
      category: 'E-commerce · Branding',
      filters: ['E-commerce', 'Branding'],
      title: 'Sifted Store',
      desc: 'Rebrand and headless store for specialty coffee: a new checkout halved the path to purchase.',
      cover: '', coverAlt: 'Preview of the Sifted Store',
      year: 2025,
      tags: ['Shopify', 'Headless', 'Identity', 'Motion'],
      metrics: [
        { num: '+52%', label: 'checkout conversion' },
        { num: '−40%', label: 'cart abandonment' }
      ],
      featured: true, hue: 200
    },
    {
      id: 'mer-04', slug: 'meridian-health',
      category: 'HealthTech · Web App',
      filters: ['Web Apps', 'UX/UI'],
      title: 'Meridian Health',
      desc: 'A telemedicine platform: doctor booking, video visits and medical history in one secure space.',
      cover: '', coverAlt: 'Preview of the Meridian Health platform',
      year: 2024,
      tags: ['React', 'Node', 'WebRTC', 'HIPAA'],
      metrics: [
        { num: '−45%', label: 'time to book' },
        { num: '60k', label: 'visits per month' }
      ],
      featured: false, hue: 168
    },
    {
      id: 'vlt-05', slug: 'volt-mobility',
      category: 'Mobility · Mobile App',
      filters: ['Mobile Apps', 'Branding'],
      title: 'Volt Mobility',
      desc: 'A kick-scooter sharing app from scratch: real-time map, one-tap payment and an identity you recognise on the street.',
      cover: '', coverAlt: 'Preview of the Volt Mobility app',
      year: 2023,
      tags: ['Flutter', 'Maps', 'Identity', 'Payments'],
      metrics: [
        { num: '120k', label: 'downloads' },
        { num: '4.8', label: 'store rating' }
      ],
      featured: false, hue: 32
    },
    {
      id: 'atl-06', slug: 'atlas-corporate',
      category: 'Corporate · Website',
      filters: ['Websites', 'UX/UI'],
      title: 'Atlas Group',
      desc: 'A brand site for an international holding: instant loading, multiple languages and a flawless Lighthouse score.',
      cover: '', coverAlt: 'Preview of the Atlas Group website',
      year: 2025,
      tags: ['Next.js', 'CMS', 'i18n', 'SEO'],
      metrics: [
        { num: '100', label: 'Lighthouse score' },
        { num: '0.8s', label: 'to interactive' }
      ],
      featured: false, hue: 210
    }
  ];

  // High-quality SVG placeholder: brand gradient + title + grid.
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

  // Card renderer for the HOME page (zigzag, large cases).
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
          <a class="case__view" href="case.html?slug=${c.slug}" aria-label="Open case study ${c.title}">
            View case
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

  // Card renderer for the GRID on the projects page (more compact).
  const renderCaseGrid = (c) => {
    const metrics = c.metrics.slice(0, 2).map(m =>
      `<div><span class="pcard__metric-num">${m.num}</span> <span class="pcard__metric-label">${m.label}</span></div>`
    ).join('');
    return `
      <article class="pcard" role="listitem" data-reveal data-filters="${c.filters.join('|')}">
        <a class="pcard__link" href="case.html?slug=${c.slug}" aria-label="Open case study ${c.title}">
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

  // Gallery placeholder (vertical/square variant).
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

  // Full render of the case page. All extended fields are optional —
  // if the admin left a block empty, it simply is not rendered (the page does not break).
  const renderCasePage = (c) => {
    const esc = s => String(s == null ? '' : s);
    const cover = c.cover
      ? `<img src="${c.cover}" alt="${esc(c.coverAlt)}" width="1200" height="750" fetchpriority="high">`
      : `<img src="${placeholderSVG(c)}" alt="${esc(c.coverAlt)}" width="1200" height="750" fetchpriority="high">`;

    const facts = [
      c.client   ? `<div class="cp__fact"><dt>Client</dt><dd>${esc(c.client)}</dd></div>` : '',
      c.year     ? `<div class="cp__fact"><dt>Year</dt><dd>${esc(c.year)}</dd></div>` : '',
      c.duration ? `<div class="cp__fact"><dt>Duration</dt><dd>${esc(c.duration)}</dd></div>` : '',
      (c.role && c.role.length) ? `<div class="cp__fact"><dt>Role</dt><dd>${c.role.join(', ')}</dd></div>` : ''
    ].join('');

    const overview = c.overview ? `
      <section class="cp__overview" data-reveal>
        <div class="cp__ov-col">
          <h2 class="cp__h2">The challenge</h2>
          <p>${esc(c.overview.challenge)}</p>
        </div>
        <div class="cp__ov-col">
          <h2 class="cp__h2">The solution</h2>
          <p>${esc(c.overview.solution)}</p>
        </div>
      </section>` : '';

    const results = (c.results && c.results.length) ? `
      <section class="cp__results" data-reveal>
        <h2 class="cp__h2">Results</h2>
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
      ? `<a href="${esc(c.liveUrl)}" class="btn btn--ghost" target="_blank" rel="noopener">View live<span class="btn__arrow" aria-hidden="true">↗</span></a>`
      : '';

    const tags = (c.tags || []).map(t => `<span class="case__tag">${esc(t)}</span>`).join('');

    return `
      <section class="cp__hero wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a> / <a href="projects.html">Projects</a> / <span>${esc(c.title)}</span>
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

  // ============================================================
  //  SANITY INTEGRATION
  //  Data lives in Sanity Studio (admin panel). loadCases makes
  //  a request to Sanity, maps the response to the site format and caches it.
  //  If Sanity is unavailable — we fall back to the inline STK_CASES,
  //  so the site stays functional under any conditions.
  // ============================================================
  const SANITY = {
    projectId: 'aau1ytum',
    dataset: 'production',
    apiVersion: '2024-01-01'
  };

  // Build a Sanity image URL from an asset reference (_ref).
  // Example _ref: "image-abc123-800x600-png"
  const imageUrl = (ref) => {
    if (!ref || typeof ref !== 'string') return '';
    const [, id, dim, fmt] = ref.split('-');
    return `https://cdn.sanity.io/images/${SANITY.projectId}/${SANITY.dataset}/${id}-${dim}.${fmt}`;
  };

  // GROQ query: fetch all cases, ordered by order.
  const GROQ_CASES = encodeURIComponent(
    '*[_type=="caseStudy"]|order(order asc){' +
    'title,"slug":slug.current,category,filters,desc,' +
    '"cover":cover.asset._ref,coverAlt,year,tags,metrics,featured,order,hue,' +
    'subtitle,client,role,duration,liveUrl,overview,results,' +
    '"gallery":gallery[]{"ref":asset._ref,alt},testimonial}'
  );
  const GROQ_QUOTES = encodeURIComponent(
    '*[_type=="testimonial"]|order(order asc){text,name,role}'
  );

  const apiURL = (query) =>
    `https://${SANITY.projectId}.api.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}?query=${query}`;

  // Map a Sanity document → the format the rest of the site expects.
  const fromSanity = (d) => ({
    id: d.slug,
    slug: d.slug,
    category: d.category || '',
    filters: d.filters || [],
    title: d.title || '',
    desc: d.desc || '',
    cover: d.cover ? imageUrl(d.cover) : '',   // empty → placeholder
    coverAlt: d.coverAlt || d.title || '',
    year: d.year || '',
    tags: d.tags || [],
    metrics: d.metrics || [],
    featured: !!d.featured,
    hue: d.hue != null ? d.hue : 220,          // placeholder until a photo exists
    subtitle: d.subtitle,
    client: d.client,
    role: d.role,
    duration: d.duration,
    liveUrl: d.liveUrl,
    overview: d.overview,
    results: d.results,
    gallery: (d.gallery || []).map(g => ({ src: g.ref ? imageUrl(g.ref) : '', alt: g.alt || '', hue: d.hue })),
    testimonial: d.testimonial
  });

  // Cache to avoid repeating the request on every page within a session.
  let _cache = null;
  let _quotes = null;

  const loadCases = async () => {
    if (_cache) return _cache;
    try {
      const res = await fetch(apiURL(GROQ_CASES), { cache: 'no-store' });
      if (!res.ok) throw new Error('Sanity ' + res.status);
      const json = await res.json();
      const items = (json.result || []).map(fromSanity);
      if (!items.length) throw new Error('empty');
      _cache = items;
      return _cache;
    } catch (e) {
      console.warn('[STK] Sanity unavailable, falling back to inline data:', e.message);
      _cache = STK_CASES;                       // graceful degradation
      return _cache;
    }
  };

  const loadQuotes = async () => {
    if (_quotes) return _quotes;
    try {
      const res = await fetch(apiURL(GROQ_QUOTES), { cache: 'no-store' });
      if (!res.ok) throw new Error('Sanity ' + res.status);
      const json = await res.json();
      _quotes = (json.result || []);
      if (!_quotes.length) throw new Error('empty');
      return _quotes;
    } catch (e) {
      _quotes = null;
      return [];   // the page has its own fallback to inline testimonials
    }
  };

  // Helpers now work with loaded data (via loadCases).
  const getFiltersFrom = (cases) => {
    const set = new Set();
    cases.forEach(c => (c.filters || []).forEach(f => set.add(f)));
    return ['All', ...Array.from(set)];
  };
  const getBySlugFrom = (cases, slug) => cases.find(c => c.slug === slug) || null;
  const getNextFrom = (cases, slug) => {
    const i = cases.findIndex(c => c.slug === slug);
    return i === -1 ? null : cases[(i + 1) % cases.length];
  };

  // Public interface.
  window.STK = {
    loadCases,
    loadQuotes,
    featured: async () => (await loadCases()).filter(c => c.featured),
    // Helpers take a list of cases (pages already have data from loadCases).
    getFilters: getFiltersFrom,
    getBySlug: getBySlugFrom,
    getNext: getNextFrom,
    placeholderSVG,
    renderCaseLarge,
    renderCaseGrid,
    renderCasePage
  };
})();
