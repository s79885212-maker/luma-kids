import Link from "next/link";
import { Logo } from "./Logo";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, TelegramIcon } from "./icons";
import { instagramLink, siteConfig, telegramLink } from "@/config/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localePath, navItems } from "@/lib/links";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="relative mt-20 overflow-hidden border-t-4 border-brand bg-white pb-24 pt-12 md:pb-12">
      <div className="container-page grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo size={72} />
          <p className="mt-3 max-w-xs text-muted">{dict.footer.tagline}</p>
          <div className="mt-5 flex gap-3">
            <a href={telegramLink} target="_blank" rel="noopener" aria-label="Telegram" className="grid size-11 place-items-center rounded-full bg-telegram text-white">
              <TelegramIcon />
            </a>
            <a href={instagramLink} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-11 place-items-center rounded-full bg-brand text-white">
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-display font-extrabold">{dict.footer.pages}</h2>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={localePath(locale, item.path)} className="text-muted hover:text-primary">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display font-extrabold">{dict.footer.contacts}</h2>
          <ul className="space-y-3 text-muted">
            {siteConfig.phone && (
              <li>
                {siteConfig.phoneRaw ? (
                  <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-2 hover:text-primary">
                    <PhoneIcon className="size-5 shrink-0" /> {siteConfig.phone}
                  </a>
                ) : (
                  <span className="flex items-center gap-2">
                    <PhoneIcon className="size-5 shrink-0" /> {siteConfig.phone}
                  </span>
                )}
              </li>
            )}
            <li>
              <a href={telegramLink} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-primary">
                <TelegramIcon className="size-5 shrink-0" /> @{siteConfig.telegramUsername}
              </a>
            </li>
            <li>
              <a href={instagramLink} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-primary">
                <InstagramIcon className="size-5 shrink-0" /> @{siteConfig.instagramUsername}
              </a>
            </li>
            {siteConfig.email && (
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-primary">
                  <MailIcon className="size-5 shrink-0" /> {siteConfig.email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <PinIcon className="mt-0.5 size-5 shrink-0" /> {siteConfig.address[locale]}
            </li>
          </ul>
        </div>
      </div>
      <p className="container-page mt-10 text-sm text-muted">
        © {siteConfig.name}. {dict.footer.rights}
      </p>
    </footer>
  );
}
