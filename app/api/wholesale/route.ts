import { isValidUzPhone } from "@/lib/phone";
import { escapeHtml, isRateLimited, sendTelegramMessage } from "@/lib/telegram";

type WholesaleBody = {
  company?: string;
  name?: string;
  phone?: string;
  city?: string;
  volume?: string;
  need?: string;
  locale?: string;
  website?: string; // honeypot
};

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return Response.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  let body: WholesaleBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (body.website) return Response.json({ ok: true });

  const company = body.company?.trim().slice(0, 150);
  const name = body.name?.trim().slice(0, 100);
  const need = body.need?.trim().slice(0, 2000);

  if (!company || !name || !need || !body.phone || !isValidUzPhone(body.phone)) {
    return Response.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const text = [
    "🏭 <b>Оптовая заявка / пошив на заказ</b>",
    "",
    `<b>Компания:</b> ${escapeHtml(company)}`,
    `<b>Контакт:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(body.phone)}`,
    `<b>Город:</b> ${escapeHtml(body.city?.trim().slice(0, 100) || "—")}`,
    `<b>Объём:</b> ${escapeHtml(body.volume?.trim().slice(0, 50) || "—")}`,
    "",
    `<b>Что нужно:</b>\n${escapeHtml(need)}`,
    "",
    `<i>Язык сайта: ${body.locale === "ru" ? "RU" : "UZ"}</i>`,
  ].join("\n");

  try {
    await sendTelegramMessage(text);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "telegram" }, { status: 502 });
  }
}
