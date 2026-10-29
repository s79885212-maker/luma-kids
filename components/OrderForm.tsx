"use client";

import { useState } from "react";
import { PhoneInput } from "./PhoneInput";
import { CheckIcon, TelegramIcon } from "./icons";
import { isValidUzPhone } from "@/lib/phone";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

type Props = {
  locale: Locale;
  productSlug: string;
  sizeOptions: { value: number; label: string }[];
  colorOptions: string[];
  initialSize: number | null;
  initialColor: string;
  t: Dictionary["form"];
  telegramHref: string;
  telegramLabel: string;
};

type Status = "idle" | "sending" | "success" | "error";

export function OrderForm({
  locale,
  productSlug,
  sizeOptions,
  colorOptions,
  initialSize,
  initialColor,
  t,
  telegramHref,
  telegramLabel,
}: Props) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!String(data.get("name")).trim()) nextErrors.name = t.required;
    if (!String(data.get("city")).trim()) nextErrors.city = t.required;
    if (!isValidUzPhone(phone)) nextErrors.phone = t.phoneInvalid;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          name: data.get("name"),
          phone,
          city: data.get("city"),
          size: Number(data.get("size")),
          color: data.get("color"),
          quantity: Number(data.get("quantity")),
          comment: data.get("comment"),
          website: data.get("website"),
          locale,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-sky text-accent">
          <CheckIcon className="size-8" />
        </div>
        <p className="text-lg font-bold">{t.success}</p>
      </div>
    );
  }

  const err = (key: string) =>
    errors[key] ? <p className="mt-1 text-sm font-semibold text-primary">{errors[key]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div>
        <label htmlFor="o-name" className="label">{t.name} *</label>
        <input id="o-name" name="name" className="field" autoComplete="name" aria-invalid={!!errors.name || undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="o-phone" className="label">{t.phone} *</label>
        <PhoneInput id="o-phone" name="phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="o-city" className="label">{t.city} *</label>
        <input id="o-city" name="city" className="field" autoComplete="address-level2" defaultValue={locale === "ru" ? "Самарканд" : "Samarqand"} aria-invalid={!!errors.city || undefined} />
        {err("city")}
      </div>
      <div className="grid grid-cols-[1fr_5.5rem] gap-3">
        <div>
          <label htmlFor="o-size" className="label">{t.size}</label>
          <select id="o-size" name="size" className="field" defaultValue={initialSize ?? sizeOptions[0]?.value}>
            {sizeOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="o-qty" className="label">{t.quantity}</label>
          <input id="o-qty" name="quantity" type="number" min={1} max={999} defaultValue={1} className="field" inputMode="numeric" />
        </div>
      </div>
      {colorOptions.length > 1 && (
        <div>
          <label htmlFor="o-color" className="label">{t.color}</label>
          <select id="o-color" name="color" className="field" defaultValue={initialColor}>
            {colorOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}
      {colorOptions.length === 1 && <input type="hidden" name="color" value={colorOptions[0]} />}
      <div>
        <label htmlFor="o-comment" className="label">{t.comment}</label>
        <textarea id="o-comment" name="comment" rows={2} className="field resize-none" placeholder={t.commentPlaceholder} />
      </div>
      {/* Ловушка для ботов: поле скрыто от людей */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === "error" && (
        <div className="rounded-2xl bg-rose p-4 text-sm">
          <p className="font-semibold">{t.error}</p>
          <a href={telegramHref} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 font-bold text-telegram">
            <TelegramIcon className="size-4" /> {telegramLabel}
          </a>
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.submit}
      </button>
      <p className="text-center text-xs text-muted">{t.privacy}</p>
    </form>
  );
}
