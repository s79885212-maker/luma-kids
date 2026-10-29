import { siteConfig } from "@/config/site";
import { formatPrice, getProduct, sizeLabel } from "@/lib/products";
import { isValidUzPhone } from "@/lib/phone";
import { escapeHtml, isRateLimited, sendTelegramMessage } from "@/lib/telegram";

type OrderBody = {
  productSlug?: string;
  name?: string;
  phone?: string;
  city?: string;
  size?: number;
  color?: string;
  quantity?: number;
  comment?: string;
  locale?: string;
  website?: string; // honeypot: заполняют только боты
};

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return Response.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  let body: OrderBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (body.website) return Response.json({ ok: true });

  const product = body.productSlug ? getProduct(body.productSlug) : undefined;
  const name = body.name?.trim().slice(0, 100);
  const city = body.city?.trim().slice(0, 100);
  const quantity = Math.min(Math.max(Math.floor(Number(body.quantity) || 1), 1), 999);

  if (!product || !name || !city || !body.phone || !isValidUzPhone(body.phone)) {
    return Response.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const size = Number(body.size);
  const sizeText = product.sizes.includes(size) ? sizeLabel(size, "ru") : "—";
  const productUrl = `${siteConfig.url}/ru/catalog/${product.slug}`;

  const text = [
    "🛍 <b>Новая заявка с сайта</b>",
    "",
    `<b>Товар:</b> <a href="${productUrl}">${escapeHtml(product.name.ru)}</a>`,
    `<b>Цена:</b> ${formatPrice(product.price)}`,
    `<b>Размер:</b> ${escapeHtml(sizeText)}`,
    `<b>Цвет:</b> ${escapeHtml(body.color?.slice(0, 50) || "—")}`,
    `<b>Количество:</b> ${quantity}`,
    `<b>Сумма:</b> ${formatPrice(product.price * quantity)}`,
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(body.phone)}`,
    `<b>Город:</b> ${escapeHtml(city)}`,
    body.comment?.trim() ? `<b>Комментарий:</b> ${escapeHtml(body.comment.trim().slice(0, 1000))}` : "",
    `<i>Язык сайта: ${body.locale === "ru" ? "RU" : "UZ"}</i>`,
  ]
    .filter((line, i, arr) => line !== "" || arr[i - 1] !== "")
    .join("\n");

  try {
    await sendTelegramMessage(text);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "telegram" }, { status: 502 });
  }
}
