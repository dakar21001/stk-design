/* =============================================================================
   ST.K DESIGN — воркер сайту
   Увесь сайт — статика (assets). Код нижче запускається ЛИШЕ для /sitemap.xml
   (див. run_worker_first у wrangler.jsonc), решту запитів Cloudflare віддає
   напряму з assets, без участі воркера.

   /sitemap.xml збирається на льоту: статичні сторінки + усі кейси з Sanity.
   Додав чи видалив кейс в адмінці → за годину він уже в sitemap.
   Якщо Sanity недоступний → віддаємо статичний sitemap.xml з репо (fallback).
   ============================================================================= */

const SITE = "https://stk-design.biz.ua";

const SANITY = { projectId: "aau1ytum", dataset: "production", apiVersion: "2024-01-01" };
const GROQ = '*[_type=="caseStudy" && defined(slug.current)]|order(order asc){"slug":slug.current,_updatedAt}';

// Статичні сторінки: шлях без мовного префікса, пріоритет, частота
const PAGES = [
  ["", "1.0", "weekly"],
  ["projects", "0.9", "weekly"],
  ["contact", "0.8", "monthly"],
  ["privacy", "0.3", "yearly"],
  ["terms", "0.3", "yearly"],
];

const CACHE_SECONDS = 3600; // кеш на краю Cloudflare: Sanity смикаємо не частіше разу на годину

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Пара uk/en з взаємними hreflang — так Google розуміє, що це переклади
function urlPair(ukPath, enPath, { priority, changefreq, lastmod }) {
  const uk = SITE + "/" + ukPath;
  const en = SITE + "/en/" + enPath;
  return [uk, en].map((loc) => [
    "  <url>",
    `    <loc>${esc(loc)}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="uk" href="${esc(uk)}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${esc(en)}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(uk)}"/>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n"));
}

export function buildSitemap(cases) {
  const urls = [];
  for (const [path, priority, changefreq] of PAGES) {
    urls.push(...urlPair(path, path, { priority, changefreq }));
  }
  for (const c of cases) {
    const q = "case?slug=" + encodeURIComponent(c.slug);
    const lastmod = c._updatedAt ? c._updatedAt.slice(0, 10) : null;
    urls.push(...urlPair(q, q, { priority: "0.7", changefreq: "monthly", lastmod }));
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join("\n") + "\n</urlset>\n";
}

async function fetchCases() {
  const url = `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}?query=${encodeURIComponent(GROQ)}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("Sanity " + res.status);
  const json = await res.json();
  const items = (json.result || []).filter((c) => c && typeof c.slug === "string" && c.slug);
  if (!items.length) throw new Error("Sanity: no cases");
  return items;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname !== "/sitemap.xml") {
      return env.ASSETS.fetch(request);
    }

    const cache = caches.default;
    const cacheKey = new Request(SITE + "/sitemap.xml", { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const body = buildSitemap(await fetchCases());
      const response = new Response(body, {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": `public, max-age=${CACHE_SECONDS}`,
          "x-sitemap-source": "sanity",
        },
      });
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (e) {
      console.warn("[sitemap] fallback to static file:", e.message);
      const fallback = await env.ASSETS.fetch(request);
      const r = new Response(fallback.body, fallback);
      r.headers.set("x-sitemap-source", "static-fallback");
      return r;
    }
  },
};
