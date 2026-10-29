import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { locales } from "@/lib/locales";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/catalog", "/sizes", "/wholesale", "/delivery", "/about", "/contacts"];
  const entry = (path: string, priority: number, lastModified?: string) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])),
      },
    }));

  return [
    ...pages.flatMap((p) => entry(p, p === "" ? 1 : p === "/catalog" ? 0.9 : 0.6)),
    ...products.flatMap((p) => entry(`/catalog/${p.slug}`, 0.8, p.createdAt)),
  ];
}
