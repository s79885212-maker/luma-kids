import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ClockIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TelegramIcon } from "@/components/icons";
import { instagramLink, siteConfig, telegramLink } from "@/config/site";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacts">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "/contacts", title: t.contactsTitle, description: t.contactsDescription });
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 py-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted">{label}</p>
        <div className="font-bold">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactsPage({ params }: PageProps<"/[locale]/contacts">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale).contacts;
  const { lat, lon } = siteConfig.geo;
  const pin = siteConfig.geo.exact ? `&z=16&pt=${lon}%2C${lat}%2Cpm2rdm` : "&z=12";
  const mapSrc = `https://yandex.uz/map-widget/v1/?ll=${lon}%2C${lat}${pin}&lang=${locale === "ru" ? "ru_RU" : "uz_UZ"}`;

  return (
    <>
      <PageHeader title={t.title} />
      <div className="container-page grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="card divide-y divide-line px-5">
          {siteConfig.phone && (
            <Row icon={<PhoneIcon />} label={t.phone}>
              {siteConfig.phoneRaw ? (
                <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-primary">{siteConfig.phone}</a>
              ) : (
                siteConfig.phone
              )}
            </Row>
          )}
          <Row icon={<TelegramIcon />} label={t.telegram}>
            <a href={telegramLink} target="_blank" rel="noopener" className="hover:text-primary">@{siteConfig.telegramUsername}</a>
          </Row>
          <Row icon={<InstagramIcon />} label={t.instagram}>
            <a href={instagramLink} target="_blank" rel="noopener" className="hover:text-primary">@{siteConfig.instagramUsername}</a>
          </Row>
          {siteConfig.email && (
            <Row icon={<MailIcon />} label={t.email}>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-primary">{siteConfig.email}</a>
            </Row>
          )}
          <Row icon={<PinIcon />} label={t.address}>{siteConfig.address[locale]}</Row>
          <Row icon={<ClockIcon />} label={t.hours}>{siteConfig.hours[locale]}</Row>
        </div>
        <section aria-label={t.mapTitle} className="min-h-[360px] overflow-hidden rounded-(--radius-card) bg-sand">
          <iframe
            src={mapSrc}
            title={t.mapTitle}
            loading="lazy"
            className="size-full min-h-[360px] border-0"
            allowFullScreen
          />
        </section>
      </div>
    </>
  );
}
