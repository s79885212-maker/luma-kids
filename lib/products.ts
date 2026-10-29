import productsData from "@/data/products.json";
import sizesData from "@/data/sizes.json";
import type { Locale } from "./i18n";

export const categories = ["girls", "boys", "babies", "school"] as const;
export type Category = (typeof categories)[number];

type Localized = { uz: string; ru: string };

export type Product = {
  id: string;
  slug: string;
  category: Category;
  name: Localized;
  description: Localized;
  price: number;
  oldPrice?: number;
  sizes: number[]; // рост в см, см. data/sizes.json
  colors: { name: Localized; hex: string }[];
  composition: Localized;
  care: Localized;
  images: string[];
  isNew: boolean;
  isHit: boolean;
  createdAt: string;
};

export type SizeRow = { height: number; age: Localized; chest: number; waist: number };

export const products = productsData as Product[];
export const sizeChart = sizesData as SizeRow[];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(value: number) {
  // 189000 -> "189 000 so'm"
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm`;
}

export function ageForHeight(height: number, locale: Locale) {
  return sizeChart.find((s) => s.height === height)?.age[locale] ?? "";
}

export function sizeLabel(height: number, locale: Locale) {
  const age = ageForHeight(height, locale);
  const cm = locale === "ru" ? "см" : "sm";
  return age ? `${age} · ${height} ${cm}` : `${height} ${cm}`;
}
