import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { WholesaleForm } from "@/components/WholesaleForm";
import { siteConfig } from "@/config/site";
import { fill, getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const tints = ["bg-rose", "bg-sky", "bg-lavender"];

export async function generateMetadata({ params }: PageProps<"/[locale]/wholesale">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "/wholesale", title: t.wholesaleTitle, description: t.wholesaleDescription });
}

export default async function WholesalePage({ params }: PageProps<"/[locale]/wholesale">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.wholesale;
  const values = { capacity: siteConfig.production.dailyCapacity, ages: siteConfig.production.ages };

  return (
    <>
      <PageHeader title={t.title} subtitle={t.intro} />
      <div className="container-page">
        <h2 className="heading mb-5">{t.forWhomTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.forWhom.map((item, i) => (
            <div key={item.title} className={`${tints[i]} rounded-(--radius-card) p-6`}>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <h2 className="heading mb-5 mt-14">{t.termsTitle}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.terms.map((term) => (
            <div key={term.title} className="card p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-primary">{term.title}</p>
              <p className="mt-2 text-lg font-bold">{fill(term.text, values)}</p>
            </div>
          ))}
        </div>

        <section id="form" className="card mt-14 p-6 sm:p-10">
          <h2 className="heading mb-6">{t.formTitle}</h2>
          <WholesaleForm locale={locale} t={t} form={dict.form} />
        </section>
      </div>
    </>
  );
}
