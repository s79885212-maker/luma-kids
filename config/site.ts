// Все контакты и настройки сайта в одном месте.
// Замените плейсхолдеры на реальные данные — остальной сайт подхватит их автоматически.

export const siteConfig = {
  name: "Luma Kids",
  // Боевой адрес сайта (без слэша в конце). Нужен для sitemap, Open Graph и schema.org.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luma-kids.vercel.app",

  // ЗАГЛУШКИ — замените на настоящие контакты.
  // Пока phoneRaw пустой, телефон показывается текстом без ссылки для звонка.
  // Пустой phone — телефон не показывается совсем.
  phone: "+998 XX XXX XX XX", // как показывать на сайте, например "+998 90 123 45 67"
  phoneRaw: "", // для ссылки tel:, например "+998901234567"
  // Username Telegram-аккаунта владельца (без @) — для кнопки «Написать в Telegram»
  telegramUsername: "lumakids_uz",
  instagramUsername: "lumak1d",
  // example.com — зарезервированный домен для примеров, письма туда никому не придут.
  // Пустая строка — email не показывается.
  email: "info@example.com",

  address: {
    uz: "Samarqand sh., Yangi bozor yaqinida",
    ru: "г. Самарканд, рядом с Янги Базаром",
    city: "Samarkand",
    country: "UZ",
  },
  // Координаты цеха для Яндекс Карты и schema.org.
  // Сейчас точка не известна: карта показывает весь Самарканд без метки (exact: false).
  // Найдите цех в Яндекс Картах → правый клик → «Что здесь?» → впишите lat/lon и поставьте exact: true.
  geo: { lat: 39.6542, lon: 66.9597, exact: false as boolean },

  // Дни работы — уточните (сейчас указаны Пн–Сб)
  hours: {
    uz: "Du–Sh: 8:00–17:00",
    ru: "Пн–Сб: 8:00–17:00",
    schema: ["Mo-Sa 08:00-17:00"],
  },

  production: {
    dailyCapacity: "500–600", // изделий в день (примерно)
    ages: "2–12",
  },
} as const;

export const telegramLink = `https://t.me/${siteConfig.telegramUsername}`;
export const instagramLink = `https://instagram.com/${siteConfig.instagramUsername}`;

export function telegramShareLink(text: string) {
  return `https://t.me/${siteConfig.telegramUsername}?text=${encodeURIComponent(text)}`;
}
