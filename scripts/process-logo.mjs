import { createReadStream, createWriteStream } from "node:fs";
import { PNG } from "pngjs";

const SRC = "public/brand/logo-official-hi.png";

function load(path) {
  return new Promise((resolve, reject) => {
    createReadStream(path)
      .pipe(new PNG())
      .on("parsed", function () {
        resolve(this);
      })
      .on("error", reject);
  });
}

function save(png, path) {
  return new Promise((resolve, reject) => {
    png.pack().pipe(createWriteStream(path)).on("finish", resolve).on("error", reject);
  });
}

/**
 * Treat the lockup as rose/gold on black and lift it onto a clean alpha.
 * Soft luminance-based alpha keeps anti-aliased edges instead of a hard 1-bit cut.
 */
function liftFromBlack(src) {
  const out = new PNG({ width: src.width, height: src.height });
  for (let i = 0; i < src.data.length; i += 4) {
    const r = src.data[i];
    const g = src.data[i + 1];
    const b = src.data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;

    // Soft floor: near-black, low-saturation JPEG noise becomes transparent.
    const t0 = 18;
    const t1 = 58;
    let alpha = 0;
    if (max <= t0 && sat < 0.18) {
      alpha = 0;
    } else if (max >= t1) {
      alpha = 255;
    } else {
      alpha = Math.round(((max - t0) / (t1 - t0)) * 255);
    }

    // Un-premultiply against black so edge pixels keep their true rose/gold.
    const a = alpha / 255;
    if (a > 0.02) {
      out.data[i] = Math.min(255, Math.round(r / a));
      out.data[i + 1] = Math.min(255, Math.round(g / a));
      out.data[i + 2] = Math.min(255, Math.round(b / a));
    }
    out.data[i + 3] = alpha;
  }
  return out;
}

function crop(src, x0, y0, x1, y1) {
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * src.width + (x0 + x)) << 2;
      const di = (y * w + x) << 2;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function padSquare(src, pad = 36) {
  const side = Math.max(src.width, src.height) + pad * 2;
  const out = new PNG({ width: side, height: side });
  const ox = Math.floor((side - src.width) / 2);
  const oy = Math.floor((side - src.height) / 2);
  for (let i = 0; i < out.data.length; i += 4) out.data[i + 3] = 0;
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const si = (y * src.width + x) << 2;
      const di = ((y + oy) * side + (x + ox)) << 2;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

const src = await load(SRC);
const clear = liftFromBlack(src);
await save(clear, "public/brand/logo-official-clear.png");

let minX = src.width;
let minY = src.height;
let maxX = 0;
let maxY = 0;
for (let y = Math.floor(src.height * 0.58); y < src.height; y++) {
  for (let x = 0; x < src.width; x++) {
    const i = (y * src.width + x) << 2;
    if (clear.data[i + 3] < 40) continue;
    const r = clear.data[i];
    const g = clear.data[i + 1];
    const b = clear.data[i + 2];
    const isRose = r > 100 && r < 210 && g > 50 && g < 150 && b > 50 && b < 155 && r - g > 18;
    if (isRose) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

const pad = Math.round(src.width * 0.008);
const stamp = crop(
  clear,
  Math.max(0, minX - pad),
  Math.max(0, minY - pad),
  Math.min(src.width - 1, maxX + pad),
  Math.min(src.height - 1, maxY + pad),
);
await save(stamp, "public/brand/logo-stamp.png");
await save(padSquare(stamp, Math.round(stamp.width * 0.18)), "public/brand/logo-stamp-square.png");

const lockup = crop(clear, 0, 0, src.width - 1, Math.max(0, minY - Math.round(src.height * 0.02)));
await save(lockup, "public/brand/logo-lockup.png");

console.log("source", src.width, "x", src.height);
console.log("lockup", lockup.width, "x", lockup.height);
console.log("stamp", stamp.width, "x", stamp.height);
