// Генерирует SVG-плейсхолдеры для товаров и страниц.
// Запуск: node scripts/generate-placeholders.mjs
// Когда появятся настоящие фото — положите .jpg/.webp в public/images и поменяйте пути в data/products.json.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const products = JSON.parse(readFileSync("data/products.json", "utf8"));
mkdirSync("public/images/products", { recursive: true });
mkdirSync("public/images/site", { recursive: true });

const shapes = {
  dress: `<path d="M330 260 L300 200 L360 180 Q400 215 440 180 L500 200 L470 260 L480 330 L600 760 Q400 810 200 760 L320 330 Z"/>`,
  cardigan: `<path d="M330 220 Q400 260 470 220 L600 280 L660 560 L590 580 L560 420 L560 780 L240 780 L240 420 L210 580 L140 560 L200 280 Z"/><g fill="#fff" opacity=".8"><circle cx="400" cy="420" r="10"/><circle cx="400" cy="520" r="10"/><circle cx="400" cy="620" r="10"/></g>`,
  skirt: `<path d="M290 300 L510 300 L520 350 L640 720 Q400 790 160 720 L280 350 Z"/><path d="M290 300 L510 300 L510 340 L290 340 Z" opacity=".7"/>`,
  hoodie: `<path d="M330 230 Q330 150 400 150 Q470 150 470 230 L600 280 L670 580 L600 600 L560 440 L560 790 L240 790 L240 440 L200 600 L130 580 L200 280 Z"/><path d="M320 600 L480 600 L500 700 L300 700 Z" opacity=".75"/>`,
  tshirt: `<path d="M330 220 Q400 270 470 220 L620 280 L680 420 L580 450 L560 410 L560 780 L240 780 L240 410 L220 450 L120 420 L180 280 Z"/><g opacity=".75"><circle cx="400" cy="520" r="60"/><circle cx="355" cy="465" r="22"/><circle cx="445" cy="465" r="22"/></g>`,
  pants: `<path d="M280 220 L520 220 L560 780 L430 780 L400 400 L370 780 L240 780 Z"/><path d="M280 220 L520 220 L522 260 L278 260 Z" opacity=".7"/>`,
  romper: `<path d="M330 220 Q400 260 470 220 L580 270 L630 420 L560 440 L540 400 L560 640 Q520 760 430 760 L400 700 L370 760 Q280 760 240 640 L260 400 L240 440 L170 420 L220 270 Z"/><g fill="#fff" opacity=".85"><circle cx="400" cy="330" r="9"/><circle cx="400" cy="400" r="9"/><circle cx="400" cy="470" r="9"/></g><path d="M420 520 l12 26 28 4 -20 20 5 28 -25 -13 -25 13 5 -28 -20 -20 28 -4z" fill="#fff" opacity=".8"/>`,
  set: `<path d="M240 200 Q300 230 360 200 L430 230 L460 330 L410 345 L400 320 L400 520 L200 520 L200 320 L190 345 L140 330 L170 230 Z"/><path d="M450 560 L650 560 L660 800 L570 800 L550 660 L530 800 L440 800 Z"/><path d="M500 210 Q560 130 620 210 L630 260 L490 260 Z"/><circle cx="530" cy="160" r="22"/><circle cx="590" cy="160" r="22"/>`,
  body: `<path d="M330 220 Q400 260 470 220 L600 270 L660 520 L590 540 L550 400 L550 640 Q480 700 440 760 L360 760 Q320 700 250 640 L250 400 L210 540 L140 520 L200 270 Z"/>`,
  shirt: `<path d="M340 210 L400 250 L460 210 L600 270 L660 600 L590 615 L560 420 L560 790 L240 790 L240 420 L210 615 L140 600 L200 270 Z"/><path d="M340 210 L400 290 L460 210 L440 200 L400 250 L360 200 Z" fill="#fff" opacity=".9"/><g fill="#fff" opacity=".9"><circle cx="400" cy="380" r="8"/><circle cx="400" cy="480" r="8"/><circle cx="400" cy="580" r="8"/><circle cx="400" cy="680" r="8"/></g>`,
  sarafan: `<path d="M330 200 L360 200 L370 330 L430 330 L440 200 L470 200 L480 360 L620 780 Q400 830 180 780 L320 360 Z"/><g stroke="#fff" stroke-width="4" opacity=".5"><path d="M330 400 L260 760"/><path d="M400 400 L400 790"/><path d="M470 400 L540 760"/></g>`,
  suit: `<path d="M340 200 L400 300 L460 200 L600 260 L650 600 L580 615 L560 440 L560 640 L240 640 L240 440 L220 615 L150 600 L200 260 Z"/><path d="M340 200 L400 300 L460 200 L430 190 L400 250 L370 190 Z" fill="#fff" opacity=".85"/><path d="M270 660 L530 660 L550 820 L430 820 L400 700 L370 820 L250 820 Z" opacity=".85"/>`,
};

const shapeFor = {
  "muslin-dress-bloom": "dress",
  "knit-cardigan-cloud": "cardigan",
  "skirt-tutu-petal": "skirt",
  "hoodie-explorer": "hoodie",
  "tshirt-little-bear": "tshirt",
  "jogger-pants-sunny": "pants",
  "romper-sleepy-star": "romper",
  "baby-set-bunny": "set",
  "baby-body-basic": "body",
  "school-shirt-classic": "shirt",
  "school-sarafan-grace": "sarafan",
  "school-suit-scholar": "suit",
};

const backgrounds = ["#FBEFE8", "#F1F0FA", "#EEF6F1", "#FFF6E5"];

function shade(hex) {
  // Белые вещи на светлом фоне не видно — немного затемняем
  return hex.toUpperCase() === "#FFFFFF" ? "#FFFFFF" : hex;
}

function productSvg(shape, color, bg, label) {
  const outline = color.toUpperCase() === "#FFFFFF" ? ` stroke="#E3D6CC" stroke-width="4"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
<rect width="800" height="1000" fill="${bg}"/>
<circle cx="650" cy="150" r="90" fill="#fff" opacity=".55"/>
<circle cx="130" cy="880" r="130" fill="#fff" opacity=".45"/>
<g fill="${shade(color)}"${outline}>${shapes[shape]}</g>
<text x="400" y="930" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="30" fill="#B49A8C" letter-spacing="4">${label}</text>
</svg>`;
}

for (const p of products) {
  const shape = shapeFor[p.slug] ?? "tshirt";
  p.images.forEach((src, i) => {
    const color = p.colors[i % p.colors.length].hex;
    const bg = backgrounds[(Number(p.id) + i) % backgrounds.length];
    writeFileSync(`public${src}`, productSvg(shape, color, bg, "LUMA KIDS · FOTO"));
  });
}

// Баннер главной: стилизованные силуэты детей
const kid = (x, y, s, body, head = "#F1CDB3") => `
<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="0" cy="-170" r="58" fill="${head}"/>
  <path d="M-60 -195 Q0 -260 60 -195 Q40 -225 0 -228 Q-40 -225 -60 -195Z" fill="#7A5A48"/>
  <path d="M-70 -100 Q0 -80 70 -100 L120 -40 L90 -10 L60 -40 L90 160 L-90 160 L-60 -40 L-90 -10 L-120 -40 Z" fill="${body}"/>
  <rect x="-55" y="160" width="40" height="110" rx="18" fill="${head}"/>
  <rect x="15" y="160" width="40" height="110" rx="18" fill="${head}"/>
</g>`;

writeFileSync(
  "public/images/site/hero.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE9E1"/><stop offset="1" stop-color="#EDE8F7"/></linearGradient></defs>
<rect width="1200" height="900" fill="url(#g)"/>
<circle cx="980" cy="170" r="120" fill="#FFF3D6"/>
<ellipse cx="600" cy="860" rx="620" ry="120" fill="#fff" opacity=".6"/>
<g opacity=".55" fill="#fff"><ellipse cx="220" cy="180" rx="110" ry="40"/><ellipse cx="300" cy="160" rx="80" ry="45"/></g>
${kid(330, 600, 1.15, "#F4C9C1")}
${kid(620, 560, 1.35, "#B9CDB4", "#E9C1A4")}
${kid(900, 640, 1.0, "#D9CCF0")}
<text x="600" y="880" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="26" fill="#B49A8C" letter-spacing="6">BU YERGA FOTO · ЗДЕСЬ БУДЕТ ФОТО</text>
</svg>`,
);

// Фото производства (страница «О нас»)
const workshop = (bg, accent, n) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
<rect width="800" height="600" fill="${bg}"/>
<rect x="120" y="330" width="560" height="30" rx="10" fill="#C9B3A3"/>
<rect x="160" y="360" width="20" height="160" fill="#C9B3A3"/><rect x="620" y="360" width="20" height="160" fill="#C9B3A3"/>
<path d="M300 330 L300 230 Q300 200 330 200 L470 200 Q500 200 500 230 L500 260 L440 260 L440 330 Z" fill="${accent}"/>
<rect x="420" y="250" width="12" height="60" fill="#8E7A6C"/>
<circle cx="600" cy="300" r="34" fill="#F4C9C1"/><circle cx="600" cy="300" r="12" fill="#fff"/>
<text x="400" y="570" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="24" fill="#B49A8C" letter-spacing="4">FOTO ${n}</text>
</svg>`;
writeFileSync("public/images/site/workshop-1.svg", workshop("#FBEFE8", "#B9CDB4", 1));
writeFileSync("public/images/site/workshop-2.svg", workshop("#EEF6F1", "#D9CCF0", 2));
writeFileSync("public/images/site/workshop-3.svg", workshop("#F1F0FA", "#F4C9C1", 3));

console.log("Placeholders generated");
