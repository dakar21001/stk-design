# Cloudflare Workers

Код воркерів, які працюють поза Cloudflare Pages. Деплой ручний: Cloudflare →
Workers & Pages → воркер → **Edit code** → вставити файл → **Deploy**.
Назви воркерів мають збігатися з наведеними нижче, бо адреси `*.staskozumic.workers.dev`
прописані в коді сайту.

Секретів у репозиторії немає. Вони задаються в **Settings → Variables and Secrets** (тип *Secret*).

## stk-contact — форма заявки → Telegram

- Файл: `stk-contact.js`
- URL: `https://stk-contact.staskozumic.workers.dev` (це `action` форми в `contact.html` і `en/contact.html`)
- Секрети:
  - `TELEGRAM_BOT_TOKEN` — токен бота @stk_leads_bot (@BotFather)
  - `TELEGRAM_CHAT_ID` — числовий id отримувача (людина чи група `-100…`), **не** id бота
- Дозволені origin: `ALLOWED_ORIGINS` / `ALLOWED_PATTERNS` на початку файлу
- Перевірка: `GET /health` показує, чи задані секрети, а `GET /health?tg=1` додатково перевіряє бота й чат у Telegram (значення секретів не виводяться)
- Отримувач має натиснути **Start** у боті, інакше Telegram не дасть боту написати першим

## stk-stats — воронка конверсій + дашборд

- Файл: `stk-stats.js`
- Секрети: `CF_API_TOKEN`, `CF_ACCOUNT_TAG`, `CF_SITE_TAG`, `DASH_KEY`
- Дашборд: `GET /dashboard?key=<DASH_KEY>`; діагностика: `GET /health?key=<DASH_KEY>`
