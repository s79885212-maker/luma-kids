"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CloseIcon, InstagramIcon, MenuIcon, TelegramIcon } from "./icons";
import { localePath, navItems } from "@/lib/links";
import { locales, type Locale } from "@/lib/locales";
import { instagramLink, telegramLink } from "@/config/site";

type Props = {
  locale: Locale;
  labels: Record<(typeof navItems)[number]["key"] | "menu" | "close", string>;
};

function switchLocalePath(pathname: string, target: Locale) {
  const parts = pathname.split("/");
  parts[1] = target;
  return parts.join("/") || `/${target}`;
}

export function Header({ locale, labels }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (path: string) => pathname.startsWith(localePath(locale, path));

  const langSwitch = (
    <div className="flex rounded-full bg-sand p-1 text-sm font-bold" role="group" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={l}
          scroll={false}
          onClick={() => {
            document.cookie = `locale=${l}; path=/; max-age=31536000`;
          }}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-3 py-1.5 uppercase transition ${
            l === locale ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={localePath(locale)} aria-label="Luma Kids" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <Logo size={48} />
          <span className="hidden font-display text-lg font-extrabold sm:inline">
            Luma <span className="text-brand">Kids</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={localePath(locale, item.path)}
              className={`rounded-full px-3 py-2 text-[15px] font-semibold transition hover:bg-white ${
                isActive(item.path) ? "bg-white text-primary" : "text-ink"
              }`}
            >
              {labels[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {langSwitch}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-white lg:hidden"
            onClick={() => setOpen(true)}
            aria-label={labels.menu}
            aria-expanded={open}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-ink/30"
            aria-label={labels.close}
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-cream p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full hover:bg-white"
                onClick={() => setOpen(false)}
                aria-label={labels.close}
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={localePath(locale, item.path)}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-lg font-bold ${
                    isActive(item.path) ? "bg-white text-primary" : "text-ink"
                  }`}
                >
                  {labels[item.key]}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex gap-3">
              <a href={telegramLink} target="_blank" rel="noopener" className="btn-telegram flex-1">
                <TelegramIcon /> Telegram
              </a>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener"
                className="btn-outline px-4"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
