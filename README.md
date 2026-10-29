# Luma Kids — сайт-каталог детской одежды

Сайт-витрина швейного цеха Luma Kids (Самарканд). Посетители из Instagram выбирают одежду и оставляют заявку — она приходит владельцу в Telegram. Отдельная форма для оптовых заказов и пошива.

**Технологии:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Telegram Bot API · Vercel.
**Языки:** узбекский (латиница, по умолчанию) и русский — адреса `/uz/...` и `/ru/...`.

---

## Структура проекта

```
app/
  [locale]/                 все страницы на двух языках
    page.tsx                главная
    catalog/page.tsx        каталог с фильтрами
    catalog/[slug]/         карточка товара + картинка-превью для Telegram
    sizes/ wholesale/ delivery/ about/ contacts/
    opengraph-image.tsx     общая картинка-превью ссылки
  api/order/route.ts        заявка на товар → Telegram
  api/wholesale/route.ts    оптовая заявка → Telegram
  sitemap.ts robots.ts      SEO
  globals.css               цвета и стили бренда
components/                 шапка, футер, карточки, формы…
config/site.ts              ⭐ контакты: телефон, Telegram, Instagram, адрес, часы, карта
data/products.json          ⭐ товары
data/sizes.json             таблица размеров
i18n/uz.json, i18n/ru.json  ⭐ все тексты сайта
public/images/              картинки (сейчас — плейсхолдеры)
proxy.ts                    перенаправляет «/» → «/uz»
```

---

## Запуск на компьютере

Нужен Node.js 20+.

```bash
npm install
```

```bash
cp .env.example .env.local
```

Заполните `.env.local` (см. раздел про Telegram ниже), затем:

```bash
npm run dev
```

Откройте http://localhost:3000 — вас перенаправит на http://localhost:3000/uz.

---

## Telegram: куда приходят заявки

### Шаг 1. Создайте бота через @BotFather

1. Откройте в Telegram [@BotFather](https://t.me/BotFather) и нажмите **Start**.
2. Отправьте команду `/newbot`.
3. Введите имя бота, например `Luma Kids Заявки`.
4. Введите username бота — он должен заканчиваться на `bot`, например `lumakids_orders_bot`.
5. BotFather пришлёт **токен** вида `123456789:AAH...`. Это `TELEGRAM_BOT_TOKEN`. Никому его не показывайте.

### Шаг 2. Узнайте chat_id

**Вариант А — заявки приходят вам лично:**

1. Найдите своего нового бота в Telegram и нажмите **Start** (или отправьте ему любое сообщение). Без этого бот не сможет вам писать.
2. Откройте в браузере (подставьте свой токен):
   `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
3. Найдите в ответе `"chat":{"id":123456789,...` — это число и есть `TELEGRAM_CHAT_ID`.

**Вариант Б — заявки приходят в группу (удобно, если заявки смотрят несколько человек):**

1. Создайте группу в Telegram и добавьте туда бота.
2. Напишите в группе любое сообщение, например `/start`.
3. Откройте `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates` и найдите `"chat":{"id":-100...`. ID группы начинается с минуса — копируйте его целиком, вместе с `-`.

> Если `getUpdates` возвращает пустой список `"result":[]` — отправьте боту/в группу ещё одно сообщение и обновите страницу.

### Шаг 3. Пропишите переменные

В `.env.local` (на компьютере) и в настройках Vercel (на сервере):

```
TELEGRAM_BOT_TOKEN=123456789:AAH...
TELEGRAM_CHAT_ID=123456789
NEXT_PUBLIC_SITE_URL=https://ваш-домен.uz
```

Токен используется только на сервере (`lib/telegram.ts`) и никогда не попадает в браузер.

Проверка: откройте любой товар → «Buyurtma berish» → заполните форму → в Telegram придёт сообщение с товаром, размером, цветом, количеством, суммой и контактами.

---

## Деплой на Vercel

1. Создайте аккаунт на [github.com](https://github.com) и [vercel.com](https://vercel.com) (можно войти через GitHub).
2. Загрузите проект на GitHub:
   ```bash
   git init
   ```
   ```bash
   git add . && git commit -m "Luma Kids site"
   ```
   Затем создайте пустой репозиторий на GitHub и выполните команды `git remote add ...` и `git push`, которые GitHub покажет на странице репозитория.
3. На Vercel нажмите **Add New → Project**, выберите репозиторий, нажмите **Import**.
4. В разделе **Environment Variables** добавьте `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` и `NEXT_PUBLIC_SITE_URL`.
5. Нажмите **Deploy**. Через 1–2 минуты сайт будет доступен по адресу вида `luma-kids.vercel.app`.
6. Свой домен: **Project → Settings → Domains** → добавьте домен и пропишите DNS-записи, которые покажет Vercel. После этого обновите `NEXT_PUBLIC_SITE_URL` и сделайте **Redeploy**.
7. Добавьте ссылку на сайт в шапку профиля Instagram.

Каждый `git push` в основную ветку автоматически обновляет сайт.

> Изменили переменные окружения? Сделайте **Deployments → … → Redeploy**, иначе изменения не применятся.

---

## Как редактировать

### Контакты — `config/site.ts`
Телефон, username Telegram и Instagram, email, адрес на двух языках, координаты для Яндекс Карты (`geo`), часы работы, минимальная оптовая партия и сроки. Всё остальное подтянется автоматически: шапка, футер, кнопки, страница контактов, schema.org.

Координаты удобно взять в Яндекс Картах: правый клик по точке → координаты появятся вверху карточки (первое число — широта `lat`, второе — долгота `lon`).

### Товары — `data/products.json`
Каждый товар — объект в массиве:

| Поле | Что это |
|---|---|
| `id` | уникальный номер (строка) |
| `slug` | адрес страницы латиницей: `/uz/catalog/<slug>` |
| `category` | `girls` · `boys` · `babies` · `school` |
| `name`, `description`, `composition`, `care` | тексты `{ "uz": "...", "ru": "..." }` |
| `price`, `oldPrice` | цена в сумах числом (`189000`); `oldPrice` необязательна — покажет скидку |
| `sizes` | рост в см: `[92, 98, 104]` — возраст подставится из `data/sizes.json` |
| `colors` | `[{ "name": { "uz": "Pudra", "ru": "Пудровый" }, "hex": "#F4C9C1" }]` |
| `images` | пути к фото: `["/images/products/dress-1.jpg", ...]` |
| `isNew`, `isHit` | `true`/`false` — блоки «Новинки» и «Хиты» на главной |
| `createdAt` | дата `"2026-10-10"` — для сортировки «сначала новые» |

После правки сделайте `git push` — Vercel пересоберёт сайт. Если ошиблись в JSON (пропущенная запятая), сборка упадёт и Vercel покажет ошибку, а старая версия сайта продолжит работать.

### Фото и логотип
- **Логотип:** `public/images/site/logo.png`. Он же — иконка вкладки (`app/icon.png`, `app/apple-icon.png`) и логотип на картинках-превью.
- **Товары:** положите `.jpg` в `public/images/products/` и укажите пути в `images` у товара. Лучше вертикальные 4:5 (например 1080×1350). Первое фото — главное: оно в каталоге и в превью для Telegram.
- **Баннер главной:** `public/images/site/hero.jpg`.
- **Производство** (страница «О нас»): `public/images/site/workshop-*.svg` — пока плейсхолдеры, пути в `app/[locale]/about/page.tsx`.
- **Исходники** от владельца лежат в `brand/originals/` (в git не попадают — файлы большие).

Сжать большое фото перед загрузкой (macOS):

```bash
sips -s format jpeg -s formatOptions 82 -Z 1350 исходник.png --out public/images/products/новое-фото.jpg
```

Next.js сам отдаст фото в AVIF/WebP нужного размера.

### Тексты — `i18n/uz.json`, `i18n/ru.json`
Все надписи сайта, включая отзывы, преимущества, условия опта и доставки, мета-теги. Ключи в обоих файлах должны совпадать.

### Цвета и шрифты — `app/globals.css`
Палитра взята из логотипа: `--color-brand` (малиновый #E40381), `--color-accent` (голубой #00A3D6), `--color-primary` (кнопки — чуть темнее малинового ради контраста), фоны блоков `--color-rose`, `--color-sky`, `--color-lavender`. Декоративные «пузыри» как на логотипе — `components/Bubbles.tsx`. Шрифт Nunito (с кириллицей) подключается в `app/[locale]/layout.tsx`.

---

## SEO
- Мета-теги и Open Graph на обоих языках, `hreflang`, canonical.
- Картинки-превью генерируются автоматически: общая и для каждого товара (фото + название + цена) — красиво выглядят при отправке ссылки в Telegram.
- `/sitemap.xml` и `/robots.txt`.
- schema.org: `ClothingStore` (LocalBusiness) на всех страницах, `Product` + `BreadcrumbList` на карточках.

После деплоя добавьте сайт в [Google Search Console](https://search.google.com/search-console) и [Яндекс Вебмастер](https://webmaster.yandex.ru) и отправьте `https://ваш-домен/sitemap.xml`.

---

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | локальный сервер разработки |
| `npm run build` | production-сборка (то же, что делает Vercel) |
| `npm run start` | запустить собранный сайт |
| `npm run lint` | проверка кода |
| `npm run placeholders` | пересоздать SVG-плейсхолдеры фото |
