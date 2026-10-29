import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { TruckIcon } from "@/components/icons";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const paymentStyles = ["bg-[#e3f0fb] text-[#0a6fc2]", "bg-[#e0f5f4] text-[#0b8a86]", "bg-sand text-ink"];

export async function generateMetadata({ params }: PageProps<"/[locale]/delivery">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "/delivery", title: t.deliveryTitle, description: t.deliveryDescription });
}

export default async function DeliveryPage({ params }: PageProps<"/[locale]/delivery">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale).delivery;

  return (
    <>
      <PageHeader title={t.title} />
      <div className="container-page">
        <h2 className="heading mb-5">{t.deliveryTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.items.map((item) => (
            <div key={item.title} className="card flex gap-4 p-6">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose text-primary">
                <TruckIcon />
              </div>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="heading mb-5 mt-14">{t.paymentTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.payments.map((p, i) => (
            <div key={p.title} className="card p-6">
              <span className={`inline-block rounded-xl px-4 py-2 text-lg font-extrabold ${paymentStyles[i]}`}>{p.title}</span>
              <p className="mt-3 text-muted">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-(--radius-card) bg-lavender p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold">{t.returnTitle}</h2>
          <p className="mt-2 text-muted">{t.returnText}</p>
        </div>
      </div>
    </>
  );
}
