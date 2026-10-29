import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductGallery } from "@/components/ProductGallery";
import { ChevronIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getProduct, products } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/catalog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(locale) || !product) return {};
  return pageMetadata({
    locale,
    path: `/catalog/${slug}`,
    title: product.name[locale],
    description: product.description[locale],
  });
}

// Скелетон показывается мгновенно при переходе на товар, пока подгружается его содержимое
function ProductSkeleton() {
  return (
    <div className="container-page animate-pulse pt-4 sm:pt-8">
      <div className="mb-4 h-5 w-56 rounded-full bg-sand" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square rounded-[2rem] bg-sand sm:aspect-[4/5]" />
        <div className="flex flex-col gap-4">
          <div className="h-9 w-3/4 rounded-full bg-sand" />
          <div className="h-8 w-40 rounded-full bg-sand" />
          <div className="h-24 rounded-3xl bg-sand" />
          <div className="h-12 rounded-full bg-sand" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: PageProps<"/[locale]/catalog/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/[locale]/catalog/[slug]">, "params">) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(locale) || !product) notFound();
  const dict = getDictionary(locale);
  const cardLabels = { new: dict.common.new, hit: dict.common.hit, sale: dict.common.sale };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const url = `${siteConfig.url}/${locale}/catalog/${product.slug}`;

  return (
    <div className="container-page pt-4 sm:pt-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href={`/${locale}`} className="hover:text-primary">{dict.product.breadcrumbHome}</Link>
        <ChevronIcon className="size-4" />
        <Link href={`/${locale}/catalog`} className="hover:text-primary">{dict.nav.catalog}</Link>
        <ChevronIcon className="size-4" />
        <Link href={`/${locale}/catalog?category=${product.category}`} className="hover:text-primary">
          {dict.categories[product.category]}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} alt={product.name[locale]} />
        <ProductDetails
          product={product}
          locale={locale}
          dict={{ product: dict.product, form: dict.form, common: dict.common }}
        />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="heading mb-6">{dict.product.related}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} labels={cardLabels} />
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name[locale],
          description: product.description[locale],
          image: product.images.map((src) => `${siteConfig.url}${src}`),
          sku: product.id,
          brand: { "@type": "Brand", name: siteConfig.name },
          category: dict.categories[product.category],
          material: product.composition[locale],
          color: product.colors.map((c) => c.name[locale]).join(", "),
          size: product.sizes.map((s) => `${s} cm`).join(", "),
          offers: {
            "@type": "Offer",
            url,
            price: product.price,
            priceCurrency: "UZS",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${siteConfig.url}/#business` },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: dict.product.breadcrumbHome, item: `${siteConfig.url}/${locale}` },
            { "@type": "ListItem", position: 2, name: dict.nav.catalog, item: `${siteConfig.url}/${locale}/catalog` },
            { "@type": "ListItem", position: 3, name: product.name[locale], item: url },
          ],
        }}
      />
    </div>
  );
}
