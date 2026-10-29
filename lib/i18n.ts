import uz from "@/i18n/uz.json";
import ru from "@/i18n/ru.json";

import { type Locale } from "./locales";

export { locales, defaultLocale, hasLocale, type Locale } from "./locales";

export type Dictionary = typeof uz;

const dictionaries: Record<Locale, Dictionary> = { uz, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// Подстановка значений в строку: "от {min} шт." + { min: 30 }
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

// Для schema.org и <html lang>
export const htmlLang: Record<Locale, string> = { uz: "uz-Latn", ru: "ru" };
export const ogLocale: Record<Locale, string> = { uz: "uz_UZ", ru: "ru_RU" };
