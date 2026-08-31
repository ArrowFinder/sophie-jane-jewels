import sharp from "sharp";

const SRC = "public/brand/logo-primary.png"; // 1024x527, opaque BLACK background

// 1) Key out the black background -> transparent, preserving colored art + smooth edges.
async function makeTransparent(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    // near-black => transparent; colored art => opaque, with a soft edge ramp.
    const alpha = max <= 8 ? 0 : Math.min(255, (max - 8) * 6);
    out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = alpha;
  }
  return { buffer: out, width, height };
}

const { buffer, width, height } = await makeTransparent(SRC);
const rgba = { raw: { width, height, channels: 4 } };

// Full transparent primary lockup.
await sharp(buffer, rgba).png().toFile("public/brand/logo-primary.png");

// Wordmark (EST 2001 + SOPHIE JANE JEWELS).
await sharp(buffer, rgba)
  .extract({ left: 0, top: 0, width: 1024, height: 210 })
  .trim({ threshold: 8 })
  .png()
  .toFile("public/brand/logo-wordmark.png");

// Monogram mark (oval palm + S).
await sharp(buffer, rgba)
  .extract({ left: 420, top: 340, width: 190, height: 187 })
  .trim({ threshold: 8 })
  .png()
  .toFile("public/brand/logo-mark.png");

// Recolor the wordmark by masking a solid fill with its alpha channel.
async function tintWordmark(hex, out) {
  const base = sharp("public/brand/logo-wordmark.png");
  const meta = await base.metadata();
  const alpha = await base.clone().extractChannel("alpha").toColourspace("b-w").toBuffer();
  await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: hex } })
    .joinChannel(alpha)
    .png()
    .toFile(out);
}

await tintWordmark("#681C25", "public/brand/logo-wordmark-oxblood.png");
await tintWordmark("#F5F1EA", "public/brand/logo-wordmark-cream.png");

const wm = await sharp("public/brand/logo-wordmark.png").metadata();
const mk = await sharp("public/brand/logo-mark.png").metadata();
console.log("wordmark", wm.width, "x", wm.height, "alpha:", wm.hasAlpha);
console.log("mark", mk.width, "x", mk.height, "alpha:", mk.hasAlpha);
