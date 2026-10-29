import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Шрифт с кириллицей для картинок-превью (Telegram, Instagram, WhatsApp)
async function loadFonts() {
  const dir = join(process.cwd(), "node_modules/@fontsource/nunito/files");
  const files = ["latin-800", "cyrillic-800", "latin-700", "cyrillic-700"];
  const data = await Promise.all(files.map((f) => readFile(join(dir, `nunito-${f}-normal.woff`))));
  return files.map((f, i) => ({
    // Латиница и кириллица — разные файлы, поэтому регистрируем их как два семейства
    name: f.startsWith("cyrillic") ? "NunitoCyrillic" : "Nunito",
    data: data[i],
    weight: Number(f.split("-")[1]) as 700 | 800,
    style: "normal" as const,
  }));
}

async function imageDataUri(publicPath: string) {
  const ext = publicPath.split(".").pop();
  const mime = ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : "image/jpeg";
  const file = await readFile(join(process.cwd(), "public", publicPath));
  return `data:${mime};base64,${file.toString("base64")}`;
}

export async function renderOgImage({
  title,
  subtitle,
  badge,
  image,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  image: string; // путь в public/, например /images/site/hero.jpg (svg, png или jpg)
}) {
  const [fonts, src, logo] = await Promise.all([loadFonts(), imageDataUri(image), imageDataUri("/images/site/logo.png")]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff", fontFamily: "Nunito, NunitoCyrillic" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 680, padding: 64 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={120} height={120} style={{ width: 120, height: 120 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, color: "#2a2236" }}>{title}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#665d70" }}>{subtitle}</div>
          </div>
          {badge ? (
            <div style={{ display: "flex" }}>
              <div style={{ background: "#cf0274", color: "white", fontSize: 40, fontWeight: 800, padding: "12px 32px", borderRadius: 999 }}>
                {badge}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 28, fontWeight: 700, color: "#cf0274" }}>Samarqand · Uzbekistan</div>
          )}
        </div>
        <div style={{ display: "flex", flex: 1, background: "#f4f2f4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={520} height={630} style={{ objectFit: "cover", objectPosition: "50% 20%", width: 520, height: 630 }} />
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
