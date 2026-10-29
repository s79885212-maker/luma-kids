import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { TelegramIcon } from "@/components/icons";
import { telegramLink } from "@/config/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { sizeChart } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/sizes">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "/sizes", title: t.sizesTitle, description: t.sizesDescription });
}

export default async function SizesPage({ params }: PageProps<"/[locale]/sizes">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.sizes;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.intro} />
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-rose text-sm">
                <tr>
                  <th scope="col" className="px-3 py-3 sm:px-4 font-bold">{t.age}</th>
                  <th scope="col" className="px-3 py-3 sm:px-4 font-bold">{t.height}</th>
                  <th scope="col" className="px-3 py-3 sm:px-4 font-bold">{t.chest}</th>
                  <th scope="col" className="px-3 py-3 sm:px-4 font-bold">{t.waist}</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.height} className="border-t border-line even:bg-cream/60">
                    <th scope="row" className="px-3 py-3 sm:px-4 font-semibold">{row.age[locale]}</th>
                    <td className="px-3 py-3 sm:px-4 font-bold text-primary">{row.height}</td>
                    <td className="px-3 py-3 sm:px-4">{row.chest}</td>
                    <td className="px-3 py-3 sm:px-4">{row.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="flex flex-col gap-4">
          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl font-extrabold">{t.howToTitle}</h2>
            <ol className="space-y-3">
              {t.howTo.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lavender text-sm font-bold">{i + 1}</span>
                  <span className="text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-(--radius-card) bg-sky p-6">
            <p className="mb-4 font-semibold">{t.help}</p>
            <a href={telegramLink} target="_blank" rel="noopener" className="btn-telegram w-full">
              <TelegramIcon className="size-5" /> {dict.common.writeTelegram}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
