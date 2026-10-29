import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/lib/locales";

// Адреса без языка (например /catalog) перенаправляем на /uz/catalog
// (или на язык, который посетитель выбрал раньше — он сохраняется в cookie)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasPrefix) return;

  const saved = request.cookies.get("locale")?.value ?? "";
  const locale = hasLocale(saved) ? saved : defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Пропускаем API, служебные файлы Next.js и файлы с расширением (картинки, sitemap.xml, robots.txt)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
