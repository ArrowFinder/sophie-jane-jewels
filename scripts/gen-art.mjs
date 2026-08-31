/**
 * Generates cohesive, on-brand art-directed SVG placeholders for Sophie Jane
 * Jewels. These evoke the brand (warm California/desert light, antique gold
 * line motifs, subtle grain) and stand in until real Shopify photography is
 * connected. Run: `node scripts/gen-art.mjs`
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "art");
mkdirSync(OUT, { recursive: true });

// Warm brand-adjacent palettes evoking beach / Palm Springs / Joshua Tree.
const palettes = {
  desert: ["#efe0c9", "#e6c79b", "#d79c9d"],
  dusk: ["#e9c6b0", "#d46a31", "#691c25"],
  bloom: ["#f2e3d6", "#e7c4c4", "#d79c9d"],
  gold: ["#f4e7c8", "#e9c476", "#c9a25a"],
  oxblood: ["#c98a72", "#8a2e2f", "#4f141b"],
  sand: ["#f6efe2", "#ecdcc2", "#d9c3a0"],
  sage: ["#e7e2cf", "#cbb98f", "#9a8a63"],
  sky: ["#e5ddc9", "#d9c8b0", "#b98f6e"],
};

const grain = (id) => `
  <filter id="grain-${id}">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic"/>
  </filter>`;

const softLight = (id, cx, cy) => `
  <radialGradient id="light-${id}" cx="${cx}%" cy="${cy}%" r="85%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
    <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>`;

function bg(id, pal, angle = 145) {
  const [a, b, c] = pal;
  return `
  <linearGradient id="bg-${id}" gradientTransform="rotate(${angle})">
    <stop offset="0%" stop-color="${a}"/>
    <stop offset="52%" stop-color="${b}"/>
    <stop offset="100%" stop-color="${c}"/>
  </linearGradient>`;
}

// Fine antique-gold line motifs drawn with thin strokes.
const motifs = {
  ring: (cx, cy, s) => `
    <g stroke="#3a2a20" stroke-opacity="0.5" fill="none" stroke-width="${s * 0.012}">
      <ellipse cx="${cx}" cy="${cy + s * 0.12}" rx="${s * 0.32}" ry="${s * 0.34}"/>
      <ellipse cx="${cx}" cy="${cy + s * 0.12}" rx="${s * 0.26}" ry="${s * 0.28}"/>
      <path d="M ${cx - s * 0.14} ${cy - s * 0.14} L ${cx} ${cy - s * 0.34} L ${cx + s * 0.14} ${cy - s * 0.14} Z"/>
      <circle cx="${cx}" cy="${cy - s * 0.2}" r="${s * 0.055}"/>
    </g>`,
  pendant: (cx, cy, s) => `
    <g stroke="#3a2a20" stroke-opacity="0.5" fill="none" stroke-width="${s * 0.012}">
      <path d="M ${cx - s * 0.28} ${cy - s * 0.3} Q ${cx} ${cy - s * 0.12} ${cx + s * 0.28} ${cy - s * 0.3}"/>
      <circle cx="${cx}" cy="${cy + s * 0.08}" r="${s * 0.2}"/>
      <circle cx="${cx}" cy="${cy + s * 0.08}" r="${s * 0.1}"/>
      <path d="M ${cx} ${cy - s * 0.12} L ${cx} ${cy - s * 0.12 + s * 0.0}"/>
    </g>`,
  earring: (cx, cy, s) => `
    <g stroke="#3a2a20" stroke-opacity="0.5" fill="none" stroke-width="${s * 0.012}">
      <circle cx="${cx}" cy="${cy - s * 0.22}" r="${s * 0.05}"/>
      <path d="M ${cx} ${cy - s * 0.17} L ${cx} ${cy - s * 0.02}"/>
      <path d="M ${cx - s * 0.18} ${cy + s * 0.24} Q ${cx} ${cy - s * 0.06} ${cx + s * 0.18} ${cy + s * 0.24} Q ${cx} ${cy + s * 0.42} ${cx - s * 0.18} ${cy + s * 0.24} Z"/>
    </g>`,
  bracelet: (cx, cy, s) => `
    <g stroke="#3a2a20" stroke-opacity="0.5" fill="none" stroke-width="${s * 0.012}">
      <ellipse cx="${cx}" cy="${cy}" rx="${s * 0.34}" ry="${s * 0.2}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${s * 0.28}" ry="${s * 0.15}"/>
      <circle cx="${cx - s * 0.34}" cy="${cy}" r="${s * 0.03}"/>
      <circle cx="${cx + s * 0.34}" cy="${cy}" r="${s * 0.03}"/>
    </g>`,
  stone: (cx, cy, s) => `
    <g stroke="#3a2a20" stroke-opacity="0.5" fill="none" stroke-width="${s * 0.012}">
      <path d="M ${cx - s * 0.24} ${cy - s * 0.1} L ${cx} ${cy - s * 0.3} L ${cx + s * 0.24} ${cy - s * 0.1} L ${cx} ${cy + s * 0.32} Z"/>
      <path d="M ${cx - s * 0.24} ${cy - s * 0.1} L ${cx + s * 0.24} ${cy - s * 0.1}"/>
      <path d="M ${cx} ${cy - s * 0.3} L ${cx} ${cy - s * 0.1}"/>
      <path d="M ${cx - s * 0.12} ${cy - s * 0.1} L ${cx} ${cy + s * 0.32}"/>
      <path d="M ${cx + s * 0.12} ${cy - s * 0.1} L ${cx} ${cy + s * 0.32}"/>
    </g>`,
  none: () => "",
};

function svg({ id, w, h, palette, angle, motif = "none", light = [30, 22] }) {
  const pal = palettes[palette] ?? palettes.sand;
  const s = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
  <defs>${bg(id, pal, angle)}${softLight(id, light[0], light[1])}${grain(id)}</defs>
  <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
  <rect width="${w}" height="${h}" fill="url(#light-${id})"/>
  ${motif !== "none" ? motifs[motif](cx, cy, s) : ""}
  <rect width="${w}" height="${h}" filter="url(#grain-${id})" opacity="0.55"/>
</svg>`;
}

const files = [];
const add = (name, cfg) => files.push([name, svg({ id: name.replace(/\W/g, ""), ...cfg })]);

// Heroes & editorial
add("hero-desert", { w: 1600, h: 1000, palette: "dusk", angle: 120, light: [72, 18] });
add("hero-still", { w: 1200, h: 1500, palette: "gold", angle: 160, motif: "ring", light: [30, 20] });
add("editorial-hand", { w: 1200, h: 1500, palette: "bloom", angle: 150, motif: "stone" });
add("editorial-desert", { w: 1600, h: 1000, palette: "sand", angle: 110, light: [80, 12] });
add("editorial-vitrine", { w: 1200, h: 900, palette: "sage", angle: 135, motif: "pendant" });
add("portrait-sophie", { w: 1100, h: 1400, palette: "desert", angle: 155, light: [35, 25] });
add("feature-georgian", { w: 1000, h: 1200, palette: "oxblood", angle: 150, motif: "ring" });
add("story-wide", { w: 1600, h: 900, palette: "dusk", angle: 115, light: [70, 20] });

// Category tiles
add("cat-rings", { w: 1000, h: 1250, palette: "gold", angle: 150, motif: "ring" });
add("cat-necklaces", { w: 1000, h: 1250, palette: "bloom", angle: 150, motif: "pendant" });
add("cat-earrings", { w: 1000, h: 1250, palette: "sand", angle: 150, motif: "earring" });
add("cat-bracelets", { w: 1000, h: 1250, palette: "sage", angle: 150, motif: "bracelet" });
add("cat-antique", { w: 1000, h: 1250, palette: "oxblood", angle: 150, motif: "stone" });
add("cat-vintage", { w: 1000, h: 1250, palette: "desert", angle: 150, motif: "pendant" });

// Journal imagery
const journalPals = ["sand", "bloom", "gold", "sage", "desert", "dusk"];
for (let i = 1; i <= 6; i++) {
  add(`journal-0${i}`, { w: 1200, h: 900, palette: journalPals[i - 1], angle: 120 + i * 6 });
}

// Product placeholders — square, motif-varied, palette-cycled
const prodMotifs = ["ring", "pendant", "earring", "bracelet", "stone"];
const prodPals = ["sand", "gold", "bloom", "desert", "sage", "sky"];
for (let i = 1; i <= 24; i++) {
  const n = String(i).padStart(2, "0");
  add(`product-${n}`, {
    w: 1100,
    h: 1375,
    palette: prodPals[i % prodPals.length],
    angle: 140 + (i % 5) * 8,
    motif: prodMotifs[i % prodMotifs.length],
    light: [28 + (i % 4) * 12, 20],
  });
  // A secondary angle for PDP galleries
  add(`product-${n}-b`, {
    w: 1100,
    h: 1375,
    palette: prodPals[(i + 2) % prodPals.length],
    angle: 100 + (i % 6) * 10,
    motif: prodMotifs[(i + 1) % prodMotifs.length],
    light: [60, 30],
  });
}

for (const [name, contents] of files) {
  writeFileSync(join(OUT, `${name}.svg`), contents.trim());
}
console.log(`Generated ${files.length} art files in public/art`);
