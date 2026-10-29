import { getDictionary, hasLocale } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og";
import { formatPrice, getProduct } from "@/lib/products";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Luma Kids";

// Превью товара при отправке ссылки в Telegram: фото, название и цена
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = hasLocale(raw) ? raw : "uz";
  const product = getProduct(slug);
  const dict = getDictionary(locale);
  if (!product) {
    return renderOgImage({ title: "Luma Kids", subtitle: dict.footer.tagline, image: "/images/site/hero.jpg" });
  }
  return renderOgImage({
    title: product.name[locale],
    subtitle: dict.categories[product.category],
    badge: formatPrice(product.price),
    image: product.images[0],
  });
}
