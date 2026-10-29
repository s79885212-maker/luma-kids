"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { CloseIcon } from "./icons";
import { categories, products, sizeChart, type Category } from "@/lib/products";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

type SortKey = "new" | "popular" | "priceAsc" | "priceDesc";

type Props = {
  locale: Locale;
  t: Dictionary["catalog"];
  categoryLabels: Dictionary["categories"];
  cardLabels: { new: string; hit: string; sale: string };
};

const allSizes = sizeChart.filter((s) => products.some((p) => p.sizes.includes(s.height)));
const maxPrice = Math.max(...products.map((p) => p.price));

export function CatalogView({ locale, t, categoryLabels, cardLabels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Фильтры храним в URL — ссылкой на отфильтрованный каталог можно поделиться
  const category = (categories as readonly string[]).includes(searchParams.get("category") ?? "")
    ? (searchParams.get("category") as Category)
    : null;
  const size = Number(searchParams.get("size")) || null;
  const priceMin = Number(searchParams.get("min")) || null;
  const priceMax = Number(searchParams.get("max")) || null;
  const sort = (searchParams.get("sort") as SortKey) || "new";

  function update(next: Record<string, string | number | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "" || value === 0) params.delete(key);
      else params.set(key, String(value));
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const result = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!size || p.sizes.includes(size)) &&
        (!priceMin || p.price >= priceMin) &&
        (!priceMax || p.price <= priceMax),
    );
    const sorted = [...list];
    if (sort === "priceAsc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "popular") sorted.sort((a, b) => Number(b.isHit) - Number(a.isHit));
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [category, size, priceMin, priceMax, sort]);

  const activeCount = [size, priceMin, priceMax].filter(Boolean).length;
  const cm = locale === "ru" ? "см" : "sm";

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
      active ? "border-primary bg-primary text-white" : "border-line bg-white text-ink hover:border-ink/30"
    }`;

  const extraFilters = (
    <div className="grid gap-5">
      <div>
        <label htmlFor="f-size" className="label">{t.size}</label>
        <select
          id="f-size"
          className="field"
          value={size ?? ""}
          onChange={(e) => update({ size: e.target.value || null })}
        >
          <option value="">{t.anySize}</option>
          {allSizes.map((s) => (
            <option key={s.height} value={s.height}>
              {s.age[locale]} · {s.height} {cm}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="label">{t.price}, so&apos;m</legend>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="field"
            inputMode="numeric"
            placeholder={`${t.priceFrom} 0`}
            aria-label={`${t.price} ${t.priceFrom}`}
            value={priceMin ?? ""}
            onChange={(e) => update({ min: e.target.value.replace(/\D/g, "") || null })}
          />
          <input
            className="field"
            inputMode="numeric"
            placeholder={`${t.priceTo} ${maxPrice}`}
            aria-label={`${t.price} ${t.priceTo}`}
            value={priceMax ?? ""}
            onChange={(e) => update({ max: e.target.value.replace(/\D/g, "") || null })}
          />
        </div>
      </fieldset>
      <div>
        <label htmlFor="f-sort" className="label">{t.sort}</label>
        <select id="f-sort" className="field" value={sort} onChange={(e) => update({ sort: e.target.value === "new" ? null : e.target.value })}>
          <option value="new">{t.sortNew}</option>
          <option value="popular">{t.sortPopular}</option>
          <option value="priceAsc">{t.sortPriceAsc}</option>
          <option value="priceDesc">{t.sortPriceDesc}</option>
        </select>
      </div>
      {(activeCount > 0 || category) && (
        <button type="button" className="btn-outline" onClick={() => update({ size: null, min: null, max: null, category: null })}>
          {t.reset}
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page">
      {/* Категории — горизонтальная лента на мобильных */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" className={chip(!category)} onClick={() => update({ category: null })}>
          {t.all}
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className={chip(category === c)} onClick={() => update({ category: c })}>
            {categoryLabels[c]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
        <p className="text-sm text-muted">
          {t.found}: <b className="text-ink">{result.length}</b>
        </p>
        <button type="button" className="btn-outline min-h-10 px-4 text-sm" onClick={() => setFiltersOpen(true)}>
          {t.filters}
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-white">{activeCount}</span>
          )}
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-5">{extraFilters}</div>
        </aside>

        <div>
          <p className="mb-4 hidden text-sm text-muted lg:block">
            {t.found}: <b className="text-ink">{result.length}</b>
          </p>
          {result.length === 0 ? (
            <p className="card p-8 text-center text-muted">{t.nothing}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
              {result.map((p, i) => (
                <ProductCard key={p.id} product={p} locale={locale} labels={cardLabels} priority={i < 2} headingLevel="h2" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Нижняя шторка фильтров на мобильных */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t.filters}>
          <button type="button" className="absolute inset-0 bg-ink/30" aria-label="Close" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-cream p-5 pb-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold">{t.filters}</h2>
              <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-white" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            {extraFilters}
            <button type="button" className="btn-primary mt-5 w-full" onClick={() => setFiltersOpen(false)}>
              {t.apply} ({result.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
