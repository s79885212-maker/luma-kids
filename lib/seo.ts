import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ogLocale, type Locale } from "./i18n";
import { locales } from "./locales";

// Общие мета-теги страницы: title, description, canonical, hreflang, Open Graph
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  images,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} · ${siteConfig.name}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, "x-default": `/uz${path}` },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: `/${locale}${path}`,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      // Картинка-превью по умолчанию — общая для языка (app/[locale]/opengraph-image.tsx).
      // У товаров есть своя (app/[locale]/catalog/[slug]/opengraph-image.tsx), она важнее.
      images: images ?? [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function localBusinessSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}/${locale}/opengraph-image`,
    logo: `${siteConfig.url}/icon.svg`,
    ...(siteConfig.phoneRaw ? { telephone: siteConfig.phoneRaw } : {}),
    ...(siteConfig.email && !siteConfig.email.endsWith("@example.com") ? { email: siteConfig.email } : {}),
    priceRange: "89000-399000 UZS",
    currenciesAccepted: "UZS",
    paymentAccepted: "Cash, Click, Payme",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale],
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
    ...(siteConfig.geo.exact
      ? { geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lon } }
      : {}),
    openingHours: siteConfig.hours.schema,
    sameAs: [
      `https://instagram.com/${siteConfig.instagramUsername}`,
      `https://t.me/${siteConfig.telegramUsername}`,
    ],
  };
}
