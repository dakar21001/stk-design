/* =============================================================================
   ST.K DESIGN — CONTACT WORKER (форма → Telegram)
   Приймає POST з FormData (contact.html, en/contact.html) і надсилає заявку
   в Telegram. Відповідає JSON { success: true|false }.

   СЕКРЕТИ (Settings -> Variables and Secrets, тип Secret):
     TELEGRAM_BOT_TOKEN  — токен бота від @BotFather
     TELEGRAM_CHAT_ID    — id чату/групи, куди падають заявки
   Діагностика: GET /health -> чи задані секрети (значень не показує).
   ============================================================================= */

const ALLOWED_ORIGINS = [
  "https://stk-design.biz.ua",
  "https://www.stk-design.biz.ua",
  "https://stk-design.onrender.com",   // старий хостинг, поки діє 301
];
// превʼю Cloudflare Pages і локальна розробка
const ALLOWED_PATTERNS = [
  /^https:\/\/([a-z0-9-]+\.)?stk-design\.pages\.dev$/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
];

const MAX_LEN = { name: 100, email: 150, phone: 40, messenger: 100, messenger_type: 20, type: 60, budget: 60, message: 3000, page: 200 };

const isAllowed = (o) => !!o && (ALLOWED_ORIGINS.includes(o) || ALLOWED_PATTERNS.some((r) => r.test(o)));

function cors(origin) {
  const h = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (isAllowed(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) },
  });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: isAllowed(origin) ? 204 : 403, headers: cors(origin) });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      const t = (env.TELEGRAM_BOT_TOKEN || "").trim();
      const c = (env.TELEGRAM_CHAT_ID || "").trim();
      const out = { ok: true, TELEGRAM_BOT_TOKEN: !!t, TELEGRAM_CHAT_ID: !!c };
      // ?tg=1 — перевірка токена і чату в Telegram (значень секретів не показує)
      if (url.searchParams.get("tg") && t) {
        const call = async (m, q = "") => {
          try { const r = await fetch(`https://api.telegram.org/bot${t}/${m}${q}`); return await r.json(); }
          catch (e) { return { ok: false, description: String(e) }; }
        };
        const me = await call("getMe");
        out.bot = me.ok ? "@" + me.result.username : me.description;
        if (c) {
          const ch = await call("getChat", "?chat_id=" + encodeURIComponent(c));
          out.chat = ch.ok ? { ok: true, type: ch.result.type } : { ok: false, error: ch.description };
          out.chat_id_format = /^-?\d+$/.test(c) ? "number" : "НЕ число (" + c.length + " симв.)";
        }
      }
      return json(out, 200, origin);
    }

    if (request.method !== "POST") return json({ success: false, error: "method" }, 405, origin);
    if (!isAllowed(origin)) return json({ success: false, error: "origin" }, 403, origin);

    let fd;
    try { fd = await request.formData(); }
    catch { return json({ success: false, error: "bad_body" }, 400, origin); }

    // honeypot: бот поставив галочку — робимо вигляд, що все ок
    if (fd.get("botcheck")) return json({ success: true }, 200, origin);

    const d = {};
    for (const [k, max] of Object.entries(MAX_LEN)) d[k] = clean(fd.get(k), max);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
    const phoneOk = /^[+\d][\d\s()\-]{6,}$/.test(d.phone);
    if (!d.name || !emailOk || !phoneOk || !d.message) {
      return json({ success: false, error: "validation" }, 422, origin);
    }

    const token = (env.TELEGRAM_BOT_TOKEN || "").trim();
    const chatId = (env.TELEGRAM_CHAT_ID || "").trim();
    if (!token || !chatId) return json({ success: false, error: "not_configured" }, 500, origin);

    const lang = /\/en(\/|$)/.test(request.headers.get("Referer") || "") ? "EN" : "UA";
    const lines = [
      `<b>Нова заявка з сайту</b> · ${lang}`,
      "",
      `<b>Ім'я:</b> ${esc(d.name)}`,
      `<b>Email:</b> ${esc(d.email)}`,
      `<b>Телефон:</b> ${esc(d.phone)}`,
      d.messenger ? `<b>${esc(d.messenger_type || "Месенджер")}:</b> ${esc(d.messenger)}` : null,
      d.type ? `<b>Тип проєкту:</b> ${esc(d.type)}` : null,
      d.budget ? `<b>Бюджет:</b> ${esc(d.budget)}` : null,
      "",
      `<b>Про проєкт:</b>`,
      esc(d.message),
      "",
      `<i>${esc(origin)}</i>`,
    ].filter((l) => l !== null);

    try {
      const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML", disable_web_page_preview: true }),
      });
      if (!tg.ok) {
        const info = await tg.json().catch(() => ({}));
        console.error("telegram", tg.status, info.description);
        return json({ success: false, error: "telegram", detail: info.description || tg.status }, 502, origin);
      }
    } catch (e) {
      console.error("telegram fetch", e);
      return json({ success: false, error: "telegram" }, 502, origin);
    }

    return json({ success: true }, 200, origin);
  },
};
