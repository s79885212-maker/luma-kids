import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Bubbles } from "@/components/Bubbles";
import { ArrowRightIcon, InstagramIcon, LeafIcon, NeedleIcon, StarIcon, TruckIcon } from "@/components/icons";
import { instagramLink, siteConfig } from "@/config/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { localePath } from "@/lib/links";
import { categories, products } from "@/lib/products";

const benefitIcons = [NeedleIcon, LeafIcon, TruckIcon];
const benefitColors = ["bg-rose", "bg-sky", "bg-lavender"];
const categoryColors = ["bg-rose", "bg-sky", "bg-lavender", "bg-peach/60"];
const categoryDots = ["bg-brand", "bg-accent", "bg-[#9b7be0]", "bg-brand"];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.home;
  const cardLabels = { new: dict.common.new, hit: dict.common.hit, sale: dict.common.sale };
  const reviews: { name: string; text: string }[] = t.reviews;

  const newItems = [...products]
    .filter((p) => p.isNew)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const hits = products.filter((p) => p.isHit).slice(0, 4);

  return (
    <>
      {/* Баннер */}
      <section className="container-page pt-4 sm:pt-8">
        <div className="relative grid overflow-hidden rounded-[2rem] bg-primary text-white md:grid-cols-2">
          <Bubbles variant="hero" />
          <div className="relative aspect-[4/3] md:order-2 md:m-6 md:aspect-auto md:min-h-[440px] md:overflow-hidden md:rounded-[1.5rem]">
            <Image
              src="/images/site/hero.jpg"
              alt={t.heroTitle}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="relative flex flex-col justify-center gap-5 p-6 sm:p-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-white/85">Luma Kids · Samarqand</p>
            <h1 className="font-display text-3xl font-black leading-tight sm:text-5xl">{t.heroTitle}</h1>
            <p className="text-lg text-white/90">{t.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={localePath(locale, "/catalog")} className="btn bg-white text-primary shadow-lg hover:bg-rose">
                {t.heroCta} <ArrowRightIcon className="size-5" />
              </Link>
              <Link href={localePath(locale, "/wholesale")} className="btn border-2 border-white/70 text-white hover:bg-white/10">
                {t.heroSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="container-page mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c}
              href={`${localePath(locale, "/catalog")}?category=${c}`}
              className={`${categoryColors[i]} relative flex min-h-20 items-center justify-between overflow-hidden rounded-3xl px-5 py-4 font-display text-lg font-extrabold transition hover:brightness-[0.97]`}
            >
              <span className={`absolute -right-4 -top-4 size-14 rounded-full ${categoryDots[i]} opacity-20`} aria-hidden />
              <span className="relative">{dict.categories[c]}</span>
              <ArrowRightIcon className="relative size-5 shrink-0 text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Преимущества */}
      <section className="container-page mt-16">
        <h2 className="heading mb-6">{t.benefitsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.benefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <div key={b.title} className="card p-6">
                <div className={`mb-4 grid size-12 place-items-center rounded-full ${benefitColors[i]} ${i === 1 ? "text-accent" : "text-primary"}`}>
                  <Icon />
                </div>
                <h3 className="mb-2 text-lg font-bold">{b.title}</h3>
                <p className="text-muted">{b.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Новинки */}
      <section className="container-page mt-16">
        <SectionHeader title={t.newTitle} href={localePath(locale, "/catalog")} linkLabel={dict.common.seeAll} />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {newItems.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} labels={cardLabels} />
          ))}
        </div>
      </section>

      {/* Хиты */}
      <section className="container-page mt-16">
        <SectionHeader
          title={t.hitsTitle}
          href={`${localePath(locale, "/catalog")}?sort=popular`}
          linkLabel={dict.common.seeAll}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {hits.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} labels={cardLabels} />
          ))}
        </div>
      </section>

      {/* Опт */}
      <section className="container-page mt-16">
        <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-[2rem] bg-sky p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <Bubbles variant="banner" />
          <div className="relative">
            <h2 className="heading">{t.wholesaleTitle}</h2>
            <p className="mt-2 max-w-xl text-muted">{t.wholesaleText}</p>
          </div>
          <Link href={localePath(locale, "/wholesale")} className="btn-primary relative shrink-0">
            {t.wholesaleCta} <ArrowRightIcon className="size-5" />
          </Link>
        </div>
      </section>

      {/* Отзывы: блок появится, когда в i18n/*.json → home.reviews добавят настоящие отзывы покупателей */}
      {reviews.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="heading mb-6">{t.reviewsTitle}</h2>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {reviews.map((r) => (
              <figure key={r.name} className="card w-[85%] shrink-0 snap-start p-6 sm:w-auto">
                <div className="mb-3 flex gap-0.5 text-[#f2b544]" role="img" aria-label="5/5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} className="size-5" />
                  ))}
                </div>
                <blockquote className="text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-muted">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Instagram */}
      <section className="container-page mt-16">
        <a
          href={instagramLink}
          target="_blank"
          rel="noopener"
          className="group grid items-center gap-6 overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_2px_20px_-12px_rgba(42,34,54,0.18)] sm:grid-cols-[1fr_auto] sm:p-10"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 font-extrabold text-primary">
              <InstagramIcon /> @{siteConfig.instagramUsername}
            </div>
            <h2 className="heading">{t.instagramTitle}</h2>
            <p className="mt-2 max-w-lg text-muted">{t.instagramText}</p>
            <span className="btn mt-5 bg-gradient-to-r from-primary to-accent text-white">
              {t.instagramCta}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:w-72">
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl bg-sand">
                <Image src={p.images[0]} alt="" fill sizes="96px" className="object-cover transition group-hover:scale-105" />
              </div>
            ))}
          </div>
        </a>
      </section>
    </>
  );
}
