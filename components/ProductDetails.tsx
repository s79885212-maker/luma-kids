"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderForm } from "./OrderForm";
import { CloseIcon, TelegramIcon } from "./icons";
import { siteConfig, telegramShareLink } from "@/config/site";
import { fill, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatPrice, sizeLabel, type Product } from "@/lib/products";

type Props = {
  product: Product;
  locale: Locale;
  dict: Pick<Dictionary, "product" | "form" | "common">;
};

export function ProductDetails({ product, locale, dict }: Props) {
  const t = dict.product;
  const [size, setSize] = useState<number | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [colorIndex, setColorIndex] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);
  const [sizeHint, setSizeHint] = useState(false);

  useEffect(() => {
    document.body.style.overflow = orderOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [orderOpen]);

  const colorName = product.colors[colorIndex]?.name[locale] ?? "";
  const telegramText = fill(t.telegramText, {
    name: product.name[locale],
    price: formatPrice(product.price),
    size: size ? sizeLabel(size, locale) : "—",
    color: colorName,
  });
  const telegramHref = telegramShareLink(`${telegramText}\n${siteConfig.url}/${locale}/catalog/${product.slug}`);

  function openOrder() {
    if (!size && product.sizes.length > 1) {
      setSizeHint(true);
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setOrderOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{product.name[locale]}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-extrabold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <>
              <span className="text-lg text-muted line-through">{formatPrice(product.oldPrice)}</span>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-sm font-bold text-white">
                −{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>

      <div id="size-picker">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-bold">{t.size}</span>
          <Link href={`/${locale}/sizes`} className="text-sm font-bold text-primary hover:underline">
            {t.sizeChart}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.size}>
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => {
                setSize(s);
                setSizeHint(false);
              }}
              className={`rounded-2xl border-2 px-3 py-2 text-left text-sm leading-tight transition ${
                size === s ? "border-primary bg-rose" : "border-line bg-white hover:border-ink/30"
              }`}
            >
              <span className="block font-bold">{s} {locale === "ru" ? "см" : "sm"}</span>
              <span className="block text-xs text-muted">{sizeLabel(s, locale).split(" · ")[0]}</span>
            </button>
          ))}
        </div>
        {sizeHint && <p className="mt-2 text-sm font-bold text-primary">{t.chooseSize}</p>}
      </div>

      <div>
        <span className="mb-2 block font-bold">
          {t.color}: <span className="font-normal text-muted">{colorName}</span>
        </span>
        <div className="flex gap-3" role="radiogroup" aria-label={t.color}>
          {product.colors.map((c, i) => (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={colorIndex === i}
              aria-label={c.name[locale]}
              title={c.name[locale]}
              onClick={() => setColorIndex(i)}
              className={`size-11 rounded-full border border-ink/10 ring-offset-2 ring-offset-cream transition ${
                colorIndex === i ? "ring-2 ring-primary" : ""
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" className="btn-primary" onClick={openOrder}>
          {dict.common.order}
        </button>
        <a href={telegramHref} target="_blank" rel="noopener" className="btn-telegram">
          <TelegramIcon className="size-5" /> {dict.common.writeTelegram}
        </a>
      </div>

      <dl className="card divide-y divide-line px-5">
        <div className="py-4">
          <dt className="mb-1 font-bold">{t.description}</dt>
          <dd className="text-muted">{product.description[locale]}</dd>
        </div>
        <div className="py-4">
          <dt className="mb-1 font-bold">{t.composition}</dt>
          <dd className="text-muted">{product.composition[locale]}</dd>
        </div>
        <div className="py-4">
          <dt className="mb-1 font-bold">{t.care}</dt>
          <dd className="text-muted">{product.care[locale]}</dd>
        </div>
      </dl>

      {orderOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="order-title">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={() => setOrderOpen(false)} />
          <div className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-cream p-5 pb-8 sm:max-w-lg sm:rounded-[2rem] sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="order-title" className="font-display text-xl font-extrabold">{dict.form.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {product.name[locale]} · {formatPrice(product.price)}
                </p>
              </div>
              <button type="button" className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-white" onClick={() => setOrderOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <OrderForm
              locale={locale}
              productSlug={product.slug}
              sizeOptions={product.sizes.map((s) => ({ value: s, label: sizeLabel(s, locale) }))}
              colorOptions={product.colors.map((c) => c.name[locale])}
              initialSize={size}
              initialColor={colorName}
              t={dict.form}
              telegramHref={telegramHref}
              telegramLabel={dict.common.writeTelegram}
            />
          </div>
        </div>
      )}
    </div>
  );
}
