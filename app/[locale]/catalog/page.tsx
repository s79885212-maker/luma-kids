import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogView } from "@/components/CatalogView";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { products } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/catalog">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "/catalog", title: t.catalogTitle, description: t.catalogDescription });
}

export default async function CatalogPage({ params }: PageProps<"/[locale]/catalog">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const cardLabels = { new: dict.common.new, hit: dict.common.hit, sale: dict.common.sale };

  return (
    <>
      <PageHeader title={dict.catalog.title} subtitle={dict.catalog.subtitle} />
      {/* Пока читаются фильтры из URL — сразу показываем все товары (они попадают в статический HTML) */}
      <Suspense
        fallback={
          <div className="container-page mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} labels={cardLabels} headingLevel="h2" />
            ))}
          </div>
        }
      >
        <CatalogView locale={locale} t={dict.catalog} categoryLabels={dict.categories} cardLabels={cardLabels} />
      </Suspense>
    </>
  );
}
