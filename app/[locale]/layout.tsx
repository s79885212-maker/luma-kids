import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TelegramFab } from "@/components/TelegramFab";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { getDictionary, hasLocale, htmlLang, locales } from "@/lib/i18n";
import { localBusinessSchema, pageMetadata } from "@/lib/seo";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#fffafc",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    ...pageMetadata({ locale, title: t.homeTitle, description: t.homeDescription }),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={nunito.variable}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <Header locale={locale} labels={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
        <TelegramFab label={dict.common.writeTelegram} />
        <JsonLd data={localBusinessSchema(locale)} />
      </body>
    </html>
  );
}
