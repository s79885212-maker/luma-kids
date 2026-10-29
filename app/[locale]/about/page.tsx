import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

// Фото производства: замените файлы в public/images/site/ на настоящие фотографии
const photos = ["/images/site/workshop-1.svg", "/images/site/workshop-2.svg", "/images/site/workshop-3.svg"];

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "/about", title: t.aboutTitle, description: t.aboutDescription });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale).about;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.lead} />
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4 text-lg leading-relaxed">
            {t.story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-sand">
            <Image src={photos[0]} alt={t.productionTitle} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-5">
          {t.stats.map((s) => (
            <div key={s.label} className="card p-4 text-center sm:p-6">
              <p className="font-display text-2xl font-extrabold text-primary sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="heading mb-5 mt-14">{t.productionTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {photos.map((src, i) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-(--radius-card) bg-sand">
              <Image src={src} alt={`${t.productionTitle} ${i + 1}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
