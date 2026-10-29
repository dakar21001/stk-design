---
version: 1.0
name: ST.K-Design-system
description: >-
  «Quiet Confidence» — дизайн-система digital-агенції ST.K Design (stk-design.biz.ua).
  Тепло-білий папір замість чистого білого, графітовий текст замість чорного, один
  кобальтовий акцент, який з'являється рідко й лише там, де треба діяти. Великий
  гротеск Space Grotesk у заголовках, Inter Tight у тексті. Багато повітря, 8pt-сітка,
  м'які радіуси, кнопки-пігулки, спокійний рух з довгим ease-out.

colors:
  ink: "#0B0B0C"            # основний текст, графіт (не pure black)
  paper: "#F7F6F2"          # фон сторінки, тепло-білий папір
  paper-2: "#EFEEE8"        # м'яка поверхня: секції, плашки, перемикачі
  mist: "#E4E2DB"           # тонкі лінії й рамки полів
  slate: "#6B6A64"          # другорядний текст, підписи
  cobalt: "#1F49E0"         # єдиний акцент: основна дія, фокус, виділення
  cobalt-deep: "#163AB8"    # hover / pressed для акценту
  on-accent: "#FFFFFF"      # текст на кобальті
  error: "#D64545"          # помилки форм
  # семантичні ролі (CSS custom properties)
  bg: "{colors.paper}"
  bg-surface: "{colors.paper-2}"
  text: "{colors.ink}"
  text-muted: "{colors.slate}"
  line: "{colors.mist}"
  accent: "{colors.cobalt}"
  accent-hover: "{colors.cobalt-deep}"

typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.2rem + 7.2vw, 8.5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.04em
  h2:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 2rem + 3vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.03em
  h3:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.4vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  lead:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1rem + 0.7vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.3vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: 0.85rem
    fontWeight: 500
    lineHeight: 1.4
  button:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: 0.98rem
    fontWeight: 500
    lineHeight: 1
  logo:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: 1.35rem
    fontWeight: 500
    letterSpacing: -0.02em

rounded:
  focus: 4px
  field: 12px
  card: 14px          # --radius: картки кейсів, медіа, блоки результатів
  pill: 100px         # кнопки, теги, перемикачі
  circle: 50%         # круглі іконкові кнопки (стрілки слайдера)

spacing:              # 8pt grid
  sp-1: 0.5rem        # 8px
  sp-2: 1rem          # 16px
  sp-3: 1.5rem        # 24px
  sp-4: 2rem          # 32px
  sp-6: 3rem          # 48px
  sp-8: 4rem          # 64px
  sp-12: 6rem         # 96px
  sp-16: 8rem         # 128px
  sp-20: 10rem        # 160px

layout:
  maxWidth: 1320px
  gutter: "clamp(1.25rem, 5vw, 4rem)"

motion:
  ease: "cubic-bezier(0.22, 1, 0.36, 1)"
  duration: 0.7s
  press: "scale(0.97)"

components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.on-accent}"
    hoverBackground: "{colors.cobalt-deep}"
    typography: "{typography.button}"
    padding: "0.85rem 1.5rem"
    rounded: "{rounded.pill}"
    extra: "стрілка → зсувається на 4px вправо при hover"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    border: "1px solid {colors.mist}"
    hoverBorder: "{colors.ink}"
    rounded: "{rounded.pill}"
  field:
    backgroundColor: "{colors.paper}"
    border: "1px solid {colors.mist}"
    hoverBorder: "{colors.slate}"
    focusBorder: "{colors.cobalt}"
    focusRing: "0 0 0 3px cobalt @ 15%"
    rounded: "{rounded.field}"
    padding: "0.9rem 1rem"
    label: "{typography.label}, над полем; обов'язкове поле позначено кобальтовою *"
    error: "рамка {colors.error} + текст помилки під полем 0.8rem"
  segmented-toggle:
    track: "{colors.paper-2} з рамкою {colors.mist}, pill"
    active: "{colors.cobalt} / {colors.on-accent}"
  header:
    rest: "прозорий, padding 24px"
    stuck: "фон paper 82% + blur 14px, нижня лінія mist, padding 16px"
---

## Overview

ST.K Design продає продуманість, тому інтерфейс має виглядати так, ніби в ньому нічого не
випадкового. Основа — теплий папір `#F7F6F2` і графіт `#0B0B0C`: м'якше за чисто біле й
чорне, але з високим контрастом. Кобальт `#1F49E0` — єдиний колір, що кличе до дії; він
не прикрашає, а показує, куди натискати. Характер створюють великі заголовки Space Grotesk
з тісним трекінгом і велика кількість вільного простору.

## Colors

- **Папір / графіт** — фон і текст усієї сторінки. Тема одна (світла), секції не інвертуються.
- **paper-2** — єдиний спосіб відокремити поверхню: крок тону, а не тінь.
- **mist** — рамки полів форм і тонкі розділювачі в наявних сторінках.
- **slate** — тільки для другорядного тексту (підписи, примітки). Основний текст завжди в ink.
- **Кобальт** — основна кнопка, фокус, виділення тексту, позначка обов'язкового поля.
  Не більше двох «кобальтових» місць на екран.
- **Помилка** `#D64545` — лише стани валідації.

## Typography

- **Space Grotesk 500** — заголовки й логотип. Трекінг від −0.02em (h3) до −0.04em (display).
- **Inter Tight 400/500** — текст, підписи, кнопки.
- Розміри — плавні `clamp()` від телефона до десктопа. Основні кроки: display, h2, h3, lead, body.
- Числа в метриках — Space Grotesk; у підписах — `font-variant-numeric: tabular-nums`.
- Вирівнювання ліве за замовчуванням.

## Layout

- Контейнер `max-width: 1320px`, поля `clamp(1.25rem, 5vw, 4rem)`, однакові з обох боків.
- 8pt-сітка відступів (sp-1 … sp-20). Між секціями 128–160px на десктопі.
- Брейкпоінти, що вже використовуються: 1000, 900, 860, 640, 560, 480px.
- Hero: `min-height: 100svh`, текст ліворуч.

## Elevation & Depth

Глибина — тоном (paper → paper-2), а не тінями. Розмиття фону — тільки у шапці при прокрутці
та в мобільному меню. Градієнти — лише як маска для плавного краю (біжучий рядок, фото), не як фон.

## Shapes

- Кнопки, теги, перемикачі — повна пігулка (100px).
- Поля форм — 12px.
- Картки, медіа, блоки результатів — 14px.
- Круглі кнопки-стрілки — 50%.

## Components

**Кнопки.** Primary — кобальт, біла підпис, стрілка `→` що зсувається при hover, `scale(0.97)` при
натисканні. Ghost — прозора з рамкою mist, рамка темнішає при hover. Підпис кнопки в один рядок.

**Форми.** Лейбл над полем, помилка під полем, фокус — кобальтова рамка з м'яким кільцем.
Поля контакту: ім'я, email, телефон (обов'язкові), месенджер Telegram/Viber, тип проєкту,
бюджет, повідомлення. Назви полів (`name`, `email`, `phone`, `messenger_type`, `messenger`,
`type`, `budget`, `message`) очікує воркер `stk-contact`; аналітика шукає `form#contactForm`
і `a.btn--primary[href*="contact"]`. Не перейменовувати без оновлення воркера й аналітики.

**Шапка.** Логотип `ST.K` (крапка кобальтова), 4 посилання, перемикач UK/EN, основна кнопка.
На мобільному — бургер і повноекранне меню.

## Do's and Don'ts

**Do**
- Один акцент на сторінці, і це кобальт.
- Великий заголовок + короткий текст + одна дія на екран.
- Реальні роботи й реальні відгуки. Жодних вигаданих клієнтів, цифр чи логотипів.
- Рух — підйом 16–32px з прозорістю, `ease` `cubic-bezier(0.22,1,0.36,1)`, завжди з
  fallback для `prefers-reduced-motion`.

**Don't**
- Темна тема чи інвертовані секції (темну тему свідомо прибрали).
- Фіолетові / неонові градієнти, свічення, тіні на спокійних елементах.
- Три однакові картки з іконками в ряд.
- Pure black `#000` чи pure white як фон.
- Довге тире в текстах інтерфейсу.

## Нові сторінки (посадкові, розділи)

Нові сторінки будуються скілом `design-taste-frontend` (`.claude/skills/`) у режимі
`--keep palette,type`: кольори й шрифти — звідси, композиція — з його бібліотеки. Його
правила (без надписів-«бровей» над заголовками, без нумерації 01/02, без тонких ліній-декору,
без градієнтів і тіней) діють для нових сторінок поверх цієї системи. Перевірка —
`node .claude/skills/design-taste-frontend/scripts/inspect.mjs <сторінка>` на 1440/768/390px.

## Responsive Behavior

- ≤ 900px: шапка згортається в бургер, сітки — в одну колонку.
- ≤ 560px: парні поля форми стають одне під одним.
- Тач-цілі не менше 44×44px.

## Known Gaps

- **Space Grotesk не має кирилиці.** На наявних сторінках українські заголовки показуються
  системним шрифтом (fallback). Посадкова `/start` використовує для заголовків Inter Tight
  (self-hosted з `/fonts/`), а Space Grotesk лишається для латиниці (логотип). Рішення для
  всього сайту: або Inter Tight у заголовках, або кириличний гротеск-замінник.

- Темної теми немає (рішення бренду).
- Частина наявних сторінок використовує дрібні uppercase-надписи над заголовками та тонкі
  рамки — для нових сторінок ці прийоми не використовуємо.
