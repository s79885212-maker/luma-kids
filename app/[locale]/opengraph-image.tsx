import { getDictionary, hasLocale } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Luma Kids";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(hasLocale(locale) ? locale : "uz");
  return renderOgImage({
    title: dict.home.heroTitle,
    subtitle: dict.footer.tagline,
    image: "/images/site/hero.jpg",
  });
}
