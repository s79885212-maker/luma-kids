import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import type { Locale } from "@/lib/locales";

type Props = {
  product: Product;
  locale: Locale;
  labels: { new: string; hit: string; sale: string };
  priority?: boolean;
  // В каталоге карточки идут сразу после h1, поэтому там заголовок h2
  headingLevel?: "h2" | "h3";
};

export function ProductCard({ product, locale, labels, priority, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const cm = locale === "ru" ? "см" : "sm";
  const minSize = Math.min(...product.sizes);
  const maxSize = Math.max(...product.sizes);

  return (
    <Link
      href={`/${locale}/catalog/${product.slug}`}
      className="group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_rgba(42,34,54,0.28)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name[locale]}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.isNew && (
            <span className="rounded-full bg-[#0079a0] px-2.5 py-1 text-xs font-bold text-white">{labels.new}</span>
          )}
          {product.isHit && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">{labels.hit}</span>
          )}
          {product.oldPrice && (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-primary">
              −{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <Heading className="line-clamp-2 text-[15px] font-bold leading-snug sm:text-base">{product.name[locale]}</Heading>
        <p className="text-xs text-muted">
          {minSize}–{maxSize} {cm}
        </p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="font-extrabold text-primary">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
