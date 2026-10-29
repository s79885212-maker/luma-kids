import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Чтобы открывать dev-сервер с телефона в той же Wi-Fi сети (http://192.168.x.x:3000).
  // Действует только в режиме разработки, на сайт на Vercel не влияет.
  allowedDevOrigins: ["192.168.*.*"],
  // Картинки-превью (opengraph-image) читают шрифт и фото с диска — включаем эти файлы в серверную функцию на Vercel
  outputFileTracingIncludes: {
    "/**/opengraph-image": [
      "./node_modules/@fontsource/nunito/files/nunito-{latin,cyrillic}-{700,800}-normal.woff",
      "./public/images/**/*",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
