/* =============================================================================
 * share.js - render the shareable result image on a canvas + download / share
 * -----------------------------------------------------------------------------
 * Depends on: config.js (BRAND), archetypes.js (ARCHETYPES)
 * All art is same-origin (local assets/), so the canvas stays untainted and
 * export works. Missing images fail gracefully to drawn placeholders.
 * ========================================================================== */

const Share = (() => {
  const W = BRAND.share.width;   // 1080
  const H = BRAND.share.height;  // 1350

  // Load an image; resolve to the image on success or null on failure/missing,
  // so a not-yet-added asset never blocks the render.
  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // Word-wrap text to a max width; returns array of lines.
  function wrapLines(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // Draw "contain" - fit image inside a box, centered, preserving aspect.
  function drawContain(ctx, img, bx, by, bw, bh) {
    const scale = Math.min(bw / img.width, bh / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, bx + (bw - w) / 2, by + (bh - h) / 2, w, h);
  }

  // Rounded-rect path with optional per-corner radii ({tl,tr,br,bl} or number).
  function roundRectPath(ctx, x, y, w, h, r) {
    const c = typeof r === "number"
      ? { tl: r, tr: r, br: r, bl: r }
      : Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r);
    ctx.beginPath();
    ctx.moveTo(x + c.tl, y);
    ctx.arcTo(x + w, y, x + w, y + h, c.tr);
    ctx.arcTo(x + w, y + h, x, y + h, c.br);
    ctx.arcTo(x, y + h, x, y, c.bl);
    ctx.arcTo(x, y, x + w, y, c.tl);
    ctx.closePath();
  }

  // A rotated "PASSAGE GRANTED" ink stamp in the archetype color.
  function drawStamp(ctx, cx, cy, color, scale = 1) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.08);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 0.62;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5;
    roundRectPath(ctx, -152, -58, 304, 116, 12);
    ctx.stroke();
    ctx.lineWidth = 2;
    roundRectPath(ctx, -140, -46, 280, 92, 8);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.font = `800 40px ${BRAND.fonts.body}`;
    ctx.fillText("PASSAGE", 0, -6);
    ctx.fillText("GRANTED", 0, 38);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  /* Render the result as a Neverland "trail pass": a stamped ticket that admits
     the bearer down their path, rather than a trading card. */
  async function render(canvas, result) {
    const arch = result.archetype;
    const ac = BRAND.archetypeColors[result.key] || BRAND.archetypeColors.pirate;
    const ink = "#2b2416"; // dark ink on the parchment ticket

    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.textAlign = "center";

    // Transparent background: the ticket floats on transparency (no gradient).

    const [logo, logomark] = await Promise.all([
      loadImage(BRAND.logo),
      loadImage(BRAND.logomark),
    ]);

    // --- Ticket geometry --------------------------------------------------
    const M = 54, tx = M, ty = M, tw = W - 2 * M, th = H - 2 * M, tr = 40;
    const bandH = 152;         // archetype header band
    const footH = 152;         // archetype footer band
    const footY0 = ty + th - footH;
    const perfY = 858;         // perforation between main + stub
    const notchR = 30;

    // Parchment body.
    const paper = ctx.createLinearGradient(0, ty, 0, ty + th);
    paper.addColorStop(0, "#f4ecd7");
    paper.addColorStop(1, "#e8dbbb");
    roundRectPath(ctx, tx, ty, tw, th, tr);
    ctx.fillStyle = paper;
    ctx.fill();

    // --- Header band ------------------------------------------------------
    roundRectPath(ctx, tx, ty, tw, bandH, { tl: tr, tr: tr });
    const band = ctx.createLinearGradient(0, ty, 0, ty + bandH);
    band.addColorStop(0, ac.main);
    band.addColorStop(1, ac.deep);
    ctx.fillStyle = band;
    ctx.fill();
    if (logomark) {
      const lh = 46, lw = logomark.width * (lh / logomark.height);
      ctx.drawImage(logomark, W / 2 - lw / 2, ty + 28, lw, lh);
    }
    ctx.fillStyle = "#fff";
    ctx.font = `700 36px ${BRAND.fonts.display}`;
    ctx.fillText("NEVERLAND TRAIL PASS", W / 2, ty + 122);

    // --- "Passage granted" stamp, centered as the pass's mark -------------
    // Center the stamp + bearer + destination group between the header band
    // bottom (ty+bandH) and the perforation (perfY): equal gap top and bottom.
    const stampY = ty + bandH + 193;
    drawStamp(ctx, W / 2, stampY, ac.main, 1.3);

    // --- Bearer + destination --------------------------------------------
    let y = stampY + 170;
    ctx.fillStyle = hexA(ink, 0.62);
    ctx.font = `700 28px ${BRAND.fonts.body}`;
    ctx.fillText("THIS PASS ADMITS ONE", W / 2, y);

    y += 128;
    ctx.fillStyle = ac.deep;
    ctx.font = `700 132px ${BRAND.fonts.display}`;
    ctx.fillText(arch.name.toUpperCase(), W / 2, y);

    y += 62;
    ctx.fillStyle = hexA(ink, 0.85);
    ctx.font = `italic 42px ${BRAND.fonts.body}`;
    ctx.fillText("bound for " + arch.territory, W / 2, y);

    // --- Perforation (notches punched through to transparent + dashed line) -
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(tx, perfY, notchR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(tx + tw, perfY, notchR, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = hexA(ink, 0.35);
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(tx + notchR + 12, perfY);
    ctx.lineTo(tx + tw - notchR - 12, perfY);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- Stub: Thornwell's note (verdict) ---------------------------------
    // Measure the verdict lines first, then vertically center the whole
    // [label + verdict] block within the stub (perfY..footY0): equal gap
    // above the label and below the last line.
    ctx.font = `italic 37px ${BRAND.fonts.body}`;
    const lines = wrapLines(ctx, "“" + result.verdict + "”", tw - 150);
    const lineH = 48;
    const blockH = 90 + (lines.length - 1) * lineH; // label + gap + verdict lines
    const blockTop = perfY + (footY0 - perfY - blockH) / 2;

    ctx.fillStyle = hexA(ink, 0.6);
    ctx.font = `700 24px ${BRAND.fonts.body}`;
    ctx.fillText("THORNWELL'S NOTE", W / 2, blockTop + 20);

    ctx.fillStyle = ink;
    ctx.font = `italic 37px ${BRAND.fonts.body}`;
    let qy = blockTop + 80;
    for (const ln of lines) { ctx.fillText(ln, W / 2, qy); qy += lineH; }

    // --- Footer band (archetype) with the white logo + url ----------------
    roundRectPath(ctx, tx, footY0, tw, footH, { br: tr, bl: tr });
    const foot = ctx.createLinearGradient(0, footY0, 0, footY0 + footH);
    foot.addColorStop(0, ac.main);
    foot.addColorStop(1, ac.deep);
    ctx.fillStyle = foot;
    ctx.fill();
    if (logo) {
      const lh = 42, lw = logo.width * (lh / logo.height);
      ctx.drawImage(logo, W / 2 - lw / 2, footY0 + 32, lw, lh);
    }
    ctx.fillStyle = hexA("#ffffff", 0.78);
    ctx.font = `500 26px ${BRAND.fonts.body}`;
    ctx.fillText(BRAND.siteUrl, W / 2, footY0 + 120);
  }

  /* Convert canvas -> Blob (promise). */
  function toBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  function fileNameFor(result) {
    return `${BRAND.share.fileName}-${result.key}.png`;
  }

  /* Download the current canvas as a PNG (user-initiated). */
  async function download(canvas, result) {
    const blob = await toBlob(canvas);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameFor(result);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Utility: hex (#rrggbb) + alpha -> rgba() string.
  function hexA(hex, a) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  return { render, download };
})();
