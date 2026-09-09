import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, pixelFn) {
  // RGBA buffer: 4 bytes per pixel + 1 filter byte per scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type (RGBA)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Pixel generator for Palavra & Paz: Warm Amber gradient background with golden cross & rays
function drawAppIcon(isMaskable) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = w / 2;

    // Corner rounding for regular icons (maskable is full bleed)
    if (!isMaskable) {
      const radius = w * 0.22;
      const cornerX = Math.max(radius - x, 0, x - (w - radius));
      const cornerY = Math.max(radius - y, 0, y - (h - radius));
      if (cornerX > 0 && cornerY > 0) {
        if (Math.sqrt(cornerX * cornerX + cornerY * cornerY) > radius) {
          return [0, 0, 0, 0]; // transparent
        }
      }
    }

    // Radial gradient from warm amber #d97706 to deep stone #1c1917 / #451a03
    const t = Math.min(dist / maxRadius, 1);
    let r = Math.round(180 * (1 - t) + 45 * t);
    let g = Math.round(110 * (1 - t) + 26 * t);
    let b = Math.round(25 * (1 - t) + 15 * t);

    // Golden Halo glow around center
    if (dist < w * 0.28) {
      const glow = (1 - dist / (w * 0.28)) * 0.45;
      r = Math.min(255, Math.round(r + 250 * glow));
      g = Math.min(255, Math.round(g + 200 * glow));
      b = Math.min(255, Math.round(b + 70 * glow));
    }

    // Subtle sunburst rays
    const angle = Math.atan2(dy, dx);
    const rayStrength = Math.pow(Math.cos(angle * 6), 2) * 0.15 * Math.max(0, 1 - dist / (w * 0.42));
    r = Math.min(255, Math.round(r + 240 * rayStrength));
    g = Math.min(255, Math.round(g + 190 * rayStrength));
    b = Math.min(255, Math.round(b + 60 * rayStrength));

    // Cross geometry (proportional, safe margin inside 70% safe zone)
    const crossWidth = w * 0.08;
    const crossHeight = h * 0.42;
    const crossBarWidth = w * 0.30;
    const crossBarHeight = h * 0.075;
    const crossTop = cy - crossHeight * 0.58;
    const crossBottom = cy + crossHeight * 0.42;
    const barTop = cy - crossHeight * 0.22;
    const barBottom = barTop + crossBarHeight;

    const inVertical = Math.abs(x - cx) <= crossWidth / 2 && y >= crossTop && y <= crossBottom;
    const inHorizontal = Math.abs(x - cx) <= crossBarWidth / 2 && y >= barTop && y <= barBottom;

    if (inVertical || inHorizontal) {
      // Golden Cross with metallic bevel highlight
      const edgeDist = inVertical
        ? Math.min(crossWidth / 2 - Math.abs(x - cx), Math.min(y - crossTop, crossBottom - y))
        : Math.min(crossBarWidth / 2 - Math.abs(x - cx), Math.min(y - barTop, barBottom - y));

      const highlight = Math.min(edgeDist / (w * 0.02), 1);
      const isTopLeft = (x <= cx) || (y <= barTop + crossBarHeight / 2);

      const cr = isTopLeft ? 255 : 230;
      const cg = isTopLeft ? 235 : 190;
      const cb = isTopLeft ? 150 : 80;

      return [cr, cg, cb, 255];
    }

    // Open Bible book arcs at bottom of cross
    const bookY = cy + crossHeight * 0.28;
    const bookH = h * 0.12;
    const bookW = w * 0.32;
    if (y >= bookY && y <= bookY + bookH && Math.abs(x - cx) <= bookW / 2) {
      const curve = Math.sin((Math.abs(x - cx) / (bookW / 2)) * Math.PI) * (h * 0.03);
      if (y >= bookY + curve && y <= bookY + curve + h * 0.035) {
        return [254, 243, 199, 240]; // soft cream gold page
      }
    }

    return [r, g, b, 255];
  };
}

// Ensure public directory exists
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

// Generate PNGs
const pwa192 = createPNG(192, 192, drawAppIcon(false));
fs.writeFileSync('./public/pwa-192x192.png', pwa192);
console.log('Created pwa-192x192.png');

const pwa512 = createPNG(512, 512, drawAppIcon(false));
fs.writeFileSync('./public/pwa-512x512.png', pwa512);
console.log('Created pwa-512x512.png');

const pwaMaskable = createPNG(512, 512, drawAppIcon(true));
fs.writeFileSync('./public/pwa-maskable-512x512.png', pwaMaskable);
console.log('Created pwa-maskable-512x512.png');

const appleTouch = createPNG(180, 180, drawAppIcon(false));
fs.writeFileSync('./public/apple-touch-icon.png', appleTouch);
console.log('Created apple-touch-icon.png');
