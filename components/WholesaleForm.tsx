"use client";

import { useState } from "react";
import { PhoneInput } from "./PhoneInput";
import { CheckIcon } from "./icons";
import { isValidUzPhone } from "@/lib/phone";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

type Props = {
  locale: Locale;
  t: Dictionary["wholesale"];
  form: Dictionary["form"];
};

export function WholesaleForm({ locale, t, form }: Props) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nextErrors: Record<string, string> = {};
    for (const key of ["company", "name", "need"]) {
      if (!String(data.get(key)).trim()) nextErrors[key] = form.required;
    }
    if (!isValidUzPhone(phone)) nextErrors.phone = form.phoneInvalid;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), phone, locale }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-sky text-accent">
          <CheckIcon className="size-8" />
        </div>
        <p className="text-lg font-bold">{form.success}</p>
      </div>
    );
  }

  const err = (key: string) =>
    errors[key] ? <p className="mt-1 text-sm font-semibold text-primary">{errors[key]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="w-company" className="label">{t.company} *</label>
        <input id="w-company" name="company" className="field" autoComplete="organization" aria-invalid={!!errors.company || undefined} />
        {err("company")}
      </div>
      <div>
        <label htmlFor="w-name" className="label">{t.contactName} *</label>
        <input id="w-name" name="name" className="field" autoComplete="name" aria-invalid={!!errors.name || undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="w-phone" className="label">{form.phone} *</label>
        <PhoneInput id="w-phone" name="phone" value={phone} onChange={setPhone} invalid={!!errors.phone} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="w-city" className="label">{form.city}</label>
        <input id="w-city" name="city" className="field" autoComplete="address-level2" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-volume" className="label">{t.volume}</label>
        <input id="w-volume" name="volume" className="field" inputMode="numeric" placeholder="100" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-need" className="label">{t.need} *</label>
        <textarea id="w-need" name="need" rows={4} className="field resize-none" placeholder={t.needPlaceholder} aria-invalid={!!errors.need || undefined} />
        {err("need")}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status === "error" && <p className="rounded-2xl bg-rose p-4 text-sm font-semibold sm:col-span-2">{form.error}</p>}
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? form.sending : form.submit}
        </button>
        <p className="mt-3 text-xs text-muted">{form.privacy}</p>
      </div>
    </form>
  );
}
