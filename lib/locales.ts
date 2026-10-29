// Отдельный файл без словарей — его импортирует proxy.ts, где важен маленький размер.
export const locales = ["uz", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
