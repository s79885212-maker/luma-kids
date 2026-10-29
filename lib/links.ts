import type { Locale } from "./locales";

export function localePath(locale: Locale, path = "") {
  return `/${locale}${path === "/" ? "" : path}`;
}

export const navItems = [
  { key: "catalog", path: "/catalog" },
  { key: "sizes", path: "/sizes" },
  { key: "wholesale", path: "/wholesale" },
  { key: "delivery", path: "/delivery" },
  { key: "about", path: "/about" },
  { key: "contacts", path: "/contacts" },
] as const;
