import { sfx } from './sound';

const EM = 20;
const ASCENT = 16;
const LINE = 24;
const FONT = `500 ${EM}px PixelHackers`;
const BASE = 0.4;
const BORDER = 6;
const PAPER_RATIO = 1.29;
const MAX_ROT = 10;
const SEED = 7;
const ZOOM = 2;
const FISHEYE = 0.15;
const BLOCK = 6;
const RIM = 2 * BLOCK;
const HANDLE_STEPS = 16;
const FPS = 20;
const STILL_SLOP = 6;
const FOCUS_MS = 1500;
const CONVERGE_MS = 700;
const DRAG_LIMIT = 220;
const HEAT_RATE = 2.2;
const BURN_R: [number, number] = [6, 44];
const GROW_MS = 4000;
const HEAL_DELAY = 12000;
const HEAL_RATE = 0.2;
const HEAL_EVERY = 4;
const READ_MS = 4000;
const DEG = Math.PI / 180;
const PARA = 14;
const HEAD_GAP = 26;
const HEAD_AFTER = 14;

const TERMS = `
These terms govern your use of PixelHackers. By downloading PixelHackers you agree to touch the wet paint at least once. By scrolling past this point you agree that you did not read this.

# 1. The Grid

Every glyph is drawn on a grid. Duh it's a pixel font. Each pixel was placed by hand. This is what I did in my free time.

PixelHackers contains zero curves. Any curves you find were brought in by you. Antialiasing is strictly prohibited on these premises. Any resemblance to other pixel fonts is the grid’s fault.

# 2. Permitted Use

PixelHackers may be used for headlines, body copy, posters, tattoos, and arguments. Printing it on paper is permitted. Burning that paper is between you and fire.

You may scale the font to any size. I don't care. Fractional pixels might look weird though. Adjust it how you'd like as well.

You may not use PixelHackers to sign a lease. I mean you can if you want? How does that work? You may not claim you drew the font, unless you drew it, in which case hi Jadden!

# 3. The Letters

Kerning pairs were negotiated in good faith between consenting letters. The numeral zero and the capital O have agreed to stay out of each other’s way.

The question mark asks politely. The exclamation mark does not. The ampersand is load bearing. Do not remove it. I really like it. &! Look & & & & & & &!

Monospaced use is not supported. Sorry Idk how to do that.

# 4. The Magnifying Glass

If you can read this, you are holding the magnifying glass correctly. Or squinting? Do not hold the magnifying glass still. Do not look at the sun through the magnifying glass. Look at the font.

Hinting is not included. Hints are available on request: hold the magnifying glass still. Readers who hold the glass perfectly still have been warned several times now. If the glass leaves a mark, please wait. It heals.

Do not attempt to burn the Privacy Policy. It has nothing to hide. Any unburned text remains in full force and effect.

# 5. The Rest of the Website

The font is not responsible for craters, nuclear winter, or love. Craters made on the globe are the sole responsibility of the person who clicked. Choosing love on the globe does not void this agreement. It is just nice.

Your WPM is between you and your keyboard. Typing faster than one hundred words per minute may summon an announcer. The announcer is not under contract and says what they want.

Paint dries in eighteen to thirty six seconds. Pink mode is a fully supported state and not a bug. Blue mode is also not a bug. I really like those colors.

Sound is off by default because we are polite. Just kiding it's blocked by the browser I think lol. The credits roll is mandatory viewing for anyone who reads this far. Please read it, it's cute.

# 6. General

Pixels are free and therefore not refundable. Please see your receipt after downloading. The receipt is not a legal document, unlike this one, which is also not a legal document.

This agreement is governed by the laws of the grid. Disputes will be settled by typing test, best of three, thirty seconds each. Copies of this agreement may be found underneath this agreement.

This clause intentionally left blank, except for this sentence. Made with encouragement from Purdue Hackers. And Alicia. Hello are you still there?
`;

const PRIVACY = `
This policy explains what PixelHackers collects about you. The short version: nothing. The long version is below, and it also says nothing, just at greater length.

# What We Collect

We collect no data. We would not know what to do with it. We do not use analytics nor do we count visitors. I don't even have the time to be doing that. Or working on this. Session recordings: none. Heatmaps: none. The only heat on this page comes from the magnifying glass. That was kinda fire!

Your keystrokes in the WPM test stay in your browser. Text you retype in the specimen is never sent anywhere. Like I said, I dont GAF!

# Cookies and Storage

Cookies: none. Crumbs: some.

Local storage is used for three things: your accent color, your sound settings, and your receipt numbers. That is it. Clearing your browser data will erase all three. I'm going to cry so so so much if you do.

The receipt order number lives on your device. It is not a real order. Please stop calling.

# Things That Do Not Track You

The globe does not track your location. It only tracks your craters, and forgets them when you reload. The world heals.

The wet paint remembers that you touched it for exactly as long as the paint stays wet. The falling glyphs do not record where they land. Moving these papers around is not logged. Stack them however you like.

The magnifying glass sees everything you point it at and tells no one. Burned paper is not backed up. That is between you and the paper.

Your cursor is your business. We did draw it, but we do not watch it.

# Third Parties

Third parties: zero. Parties: occasionally. Information about you is not shared with advertisers, because there are no advertisers.

Requests made by this page: the page, the font, and some sounds. That is the whole list. We use no fonts from anyone else. We would not need to. Look around.

If you print this page, the printer may collect data. Take that up with the printer.

# Your Rights

You have the right to access your data. Here it is: nothing. You have the right to delete your data. Done. You have the right to correct your data. Please feel free to correct nothing. You have the right to data portability. Download the font. That is portable.

Data retention period: none. Data breach notification: if we are ever breached, the attacker will find a font.

# Changes

This policy may change whenever the font gains a new glyph. Changes will be announced by quietly changing this sheet. Questions may be addressed to the nearest pixel.

We do not know who you are. We would like to keep it that way. You seem nice.

Last updated whenever you last scrolled here.
`;

const ERRATA = `
The following corrections apply to the documents on this desk. Please read them before reading the documents, or after, or not at all.

# Terms & Conditions

Section 4: for “do not hold the magnifying glass still” read “definitely do not hold the magnifying glass still.”

Section 1: “zero curves” was a typo for “zero curves.” Section 1 also incorrectly states that the grid is not negotiable. The grid is not negotiable.

Section 3 called the lowercase g well behaved. This was optimistic.

Section 6: for “best of three” read “best of five, if you are losing.”

The sun was not consulted before section 4 was written. We apologize to the sun.

# Privacy Policy

Cookies and Storage: for “crumbs” read “some crumbs.”

Third Parties: for “parties occasionally” read “parties frequently.”

# Limited Warranty

Printed with unlimited optimism. Corrected to limited optimism.

Making a Claim: for “four hundred words” read “four hundred pixels.”

# Exhibit B

Exhibit B is missing two glyphs. They are hiding. The upside down question mark is intentional. It is Spanish.

The arrows point in all four directions. This is by design and also indecision. Exhibit B misspells nothing. This is suspicious and under review.

# General

Every instance of square should read squarer. All references to antialiasing have been aliased. WPM should be read as words per minute, not wet paint meters.

Pink was briefly listed as a shade of blue. It is not. Who tf said that?
`;

const WARRANTY = `
PixelHackers is warranted against defects in squareness for as long as you own a screen. It may have defects though since I made it. This warranty gives you specific rights. You may also have other rights, which is great.

# What Is Covered

Every pixel is warranted to remain square for the lifetime of your screen. Pixels are guaranteed to be on or off since binary is 0 or 1.

The warranty covers all glyphs in the font (I don't know how many, I think at the time I'm writing this it's 458), including the ones you will never type.

Letters that fall off the page during the character rain are fully covered and will return. Accidental deletion of a glyph is covered. Intentional deletion is a design choice.

# What Is Not Covered

Subpixel rendering, bilinear filtering, and blur of any kind. Grey pixels found in the wild were caused by your renderer, not by us.

Glyphs damaged by magnifying glasses, sunlight, or curiosity. Wet paint, which is sold as is. Craters on the globe, which are cosmetic and do not affect performance.

No warranty is made regarding the world, nuked or loved.

# Making a Claim

To file a claim, describe the defective pixel in EXACTLY four hundred eighty two words. Include the date, the time, and how the pixel made you feel.

If a glyph arrives with a curve, return it immediately. That is not ours. If you can find a curve in PixelHackers, you are entitled to keep it.

# Repairs

Repairs are performed by the original pixel placer, by hand, one pixel at a time. Turnaround time is one frame. All work is performed on the grid. Off grid repairs are not recognized.

Replacement pixels ship in the same color as the original, blue or pink. If one arrives in the wrong color, press the color button.

Burn damage to these papers is covered under the self healing clause and repairs itself.

# Fine Print

This warranty transfers to anyone you send the font to. Please send it to everyone. It may not be sold, which is fine, because the font is free.

Nothing in this warranty limits your right to make things.
`;

const SPECIMEN = `
@4 Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk

@3 Supercalifragialisticexpialidocious

@3 Hamburgefonstiv

@2 Sphinx of black quartz, judge my vow.

# Text

The quick brown fox jumps over the lazy dog. How vexingly quick daft zebras jump! Jackdaws love my big sphinx of quartz. The five boxing wizards jump quickly. Waltz, bad nymph, for quick jigs vex. Glib jocks quiz nymph to vex dwarf. Bright vixens jump; dozy fowl quack.

# Uppercase

@2 ABCDEFGHIJKLMNOPQRSTUVWXYZ ÆØÐÞ

# Lowercase

@2 abcdefghijklmnopqrstuvwxyz ß

# Figures

@2 0123456789

# Symbols

@2 ! ? # & @ $ % * + = < > { } [ ] ( ) ← ↑ → ↓ ✸ ◊ ∞ ≈ ¿ ¡
`;

type Block = { kind: 'p' | 'h' | 'd'; text: string; scale: number };

const parse = (src: string): Block[] =>
  src.trim().split(/\n\s*\n/).map((raw) => {
    const t = raw.trim().replace(/\s+/g, ' ');
    if (t.startsWith('# ')) return { kind: 'h', text: t.slice(2), scale: 2 };
    const m = /^@(\d) (.*)$/.exec(t);
    if (m) return { kind: 'd', text: m[2], scale: Number(m[1]) };
    return { kind: 'p', text: t, scale: 1 };
  });

const DOCS: { title: string; blocks: Block[] }[] = [
  { title: 'Terms & Conditions', blocks: parse(TERMS) },
  { title: 'Privacy Policy', blocks: parse(PRIVACY) },
  { title: 'Errata', blocks: parse(ERRATA) },
  { title: 'Limited Warranty', blocks: parse(WARRANTY) },
  { title: 'Exhibit B', blocks: parse(SPECIMEN) },
];

type Box = { x0: number; y0: number; x1: number; y1: number };
type Sheet = {
  el: HTMLCanvasElement;
  paper: HTMLCanvasElement;
  pctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  rot: number;
  z: number;
  title: string;
  blocks: Block[];
  page: number;
  ink: Uint8Array | null;
  heat: Float32Array | null;
  img: ImageData | null;
  box: Box | null;
};
type Puff = { x: number; y: number; vx: number; vy: number; life: number; max: number; s: number; seed: number };
type Phase = 'idle' | 'gather' | 'burn';

let ignitions = 0;
let lensMs = 0;
export const finePrint = () => (ignitions ? 'Burned' : lensMs > READ_MS ? 'Read' : 'Unread');

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export async function initFinePrint(root: HTMLElement) {
  const desk = root.querySelector<HTMLElement>('.fine-desk')!;
  root.querySelector('.fine-copy')!.textContent = DOCS.map((d) => [d.title, ...d.blocks.map((b) => b.text)].join('. ')).join(' ');

  const lens = document.createElement('canvas');
  lens.className = 'fine-lens';
  lens.setAttribute('aria-hidden', 'true');
  desk.append(lens);
  const lctx = lens.getContext('2d')!;
  const view = document.createElement('canvas');
  const vctx = view.getContext('2d', { willReadFrequently: true })!;
  const out = document.createElement('canvas');
  const octx = out.getContext('2d')!;
  let outImg: ImageData | null = null;
  let warp = new Int32Array(0);

  let sheets: Sheet[] = [];
  let W = 0, H = 0, pw = 0, ph = 0, bs = BASE, deskW = 0, deskH = 0, dpr = 1;
  let accent: number[] = [0, 0, 255];
  let accentCss = 'rgb(0,0,255)';

  let lensR = 0, C = 0, D = 0, LS = 0, diag = 0;
  let glass = new Path2D();
  let rim = new Path2D();
  let edge = new Path2D();

  let moved = false;
  let dragging = false;
  let held: Sheet | null = null;
  let topZ = 0;
  let grab = { x: 0, y: 0 };
  let lx = 0, ly = 0;
  let anchorX = 0, anchorY = 0;
  let stillSince = 0, lastMoveT = 0, speed = 0;
  let phase: Phase = 'idle';
  let phaseAt = 0;
  let lastBurnAt = -Infinity;
  let burnR = BURN_R[0];
  let smoke: Puff[] = [];

  let visible = false;
  let raf = 0;
  let last = 0;
  let frame = 0;

  const readAccent = () => {
    accentCss = getComputedStyle(root).color;
    accent = (accentCss.match(/\d+/g) ?? ['0', '0', '255']).slice(0, 3).map(Number);
  };

  const typeset = (s: Sheet) => {
    const g = s.pctx;
    g.clearRect(0, 0, W, H);
    g.fillStyle = accentCss;
    g.textBaseline = 'alphabetic';
    const m = Math.round((pw * 0.08) / bs);
    const right = W - m;
    const width = right - m;

    g.font = FONT;
    const scale = clamp(Math.floor(width / g.measureText(s.title).width), 1, 4);
    g.font = `500 ${EM * scale}px PixelHackers`;
    g.fillText(s.title, m, m + ASCENT * scale);
    let y = m + EM * scale + 24;
    for (let x = m; x < right; x += 40) g.fillRect(x, y, Math.min(20, right - x), 7);
    y += 7 + 30;

    g.font = FONT;
    const foot = H - m;
    g.textAlign = 'right';
    g.fillText(`Page ${s.page} of ${sheets.length}`, right, foot);
    g.textAlign = 'left';

    const space = g.measureText(' ').width;
    const limit = foot - LINE * 2;
    const fit = (text: string, want: number) => {
      g.font = FONT;
      return clamp(Math.floor(width / g.measureText(text).width), 1, want);
    };
    let cut = false;

    outer: for (let bi = 0; bi < s.blocks.length; bi++) {
      const b = s.blocks[bi];
      if (b.kind === 'h') {
        const k = fit(b.text, b.scale);
        const top = y + (bi > 0 ? HEAD_GAP : 0);
        if (top + EM * k + HEAD_AFTER + LINE > limit) { cut = true; break; }
        g.font = `500 ${EM * k}px PixelHackers`;
        g.fillText(b.text, m, top + ASCENT * k);
        y = top + EM * k + HEAD_AFTER;
        continue;
      }
      if (b.kind === 'd') {
        const k = fit(b.text, b.scale);
        if (y + EM * k > limit) { cut = true; break; }
        g.font = `500 ${EM * k}px PixelHackers`;
        g.fillText(b.text, m, y + ASCENT * k);
        y += LINE * k + PARA;
        continue;
      }

      g.font = FONT;
      const words = b.text.split(' ');
      let wi = 0;
      while (wi < words.length) {
        if (y + LINE > limit) { cut = true; break outer; }
        const line: [string, number][] = [];
        let used = 0;
        while (wi < words.length) {
          const ww = g.measureText(words[wi]).width;
          const need = used + (line.length ? space : 0) + ww;
          if (need > width && line.length) break;
          line.push([words[wi], ww]);
          used = need;
          wi++;
        }
        const sum = line.reduce((a, [, ww]) => a + ww, 0);
        const gap = line.length > 1 && wi < words.length ? (width - sum) / (line.length - 1) : space;
        let x = m;
        for (const [w, ww] of line) {
          g.fillText(w, Math.round(x), y + ASCENT);
          x += ww + gap;
        }
        y += LINE;
      }
      y += PARA;
    }

    if (cut) {
      g.font = FONT;
      g.fillText('Continued overleaf.', m, foot);
    }

    const img = g.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = accent[0];
      d[i + 1] = accent[1];
      d[i + 2] = accent[2];
      d[i + 3] = d[i + 3] > 127 ? 255 : 0;
    }
    g.putImageData(img, 0, 0);
    s.ink = null;
    s.heat = null;
    s.img = null;
    s.box = null;
  };

  const burnable = (s: Sheet) => {
    if (s.img) return;
    s.img = s.pctx.getImageData(0, 0, W, H);
    s.ink = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) s.ink[i] = s.img.data[i * 4 + 3] > 127 ? 1 : 0;
    s.heat = new Float32Array(W * H);
  };

  const repaint = (s: Sheet, ax: number, ay: number, bx: number, by: number) => {
    if (!s.img || !s.ink || !s.heat) return;
    const x0 = Math.max(0, Math.floor(ax)), y0 = Math.max(0, Math.floor(ay));
    const x1 = Math.min(W, Math.ceil(bx)), y1 = Math.min(H, Math.ceil(by));
    if (x1 <= x0 || y1 <= y0) return;
    const d = s.img.data;
    const [r, g, b] = accent;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = y * W + x;
        const h = s.heat[i];
        const k = s.ink[i] === 1;
        let on: boolean;
        if (h >= 1) on = false;
        else if (h >= 0.75) on = true;
        else if (h >= 0.5) on = k || ((x + y) & 1) === 0;
        else if (h >= 0.25) on = k || ((x | y) & 1) === 0;
        else on = k;
        const p = i * 4;
        d[p] = r;
        d[p + 1] = g;
        d[p + 2] = b;
        d[p + 3] = on ? 255 : 0;
      }
    }
    s.pctx.putImageData(s.img, 0, 0, x0, y0, x1 - x0, y1 - y0);
  };

  const buildLens = () => {
    lensR = clamp(Math.floor((pw * 0.4) / BLOCK) * BLOCK, 72, 132);
    C = lensR + RIM + BLOCK;
    D = Math.ceil((2 * lensR) / ZOOM) + 2;
    view.width = view.height = D;

    const P = Math.round(2 * lensR * dpr);
    out.width = out.height = P;
    outImg = octx.createImageData(P, P);
    warp = new Int32Array(P * P);
    const k = FISHEYE;
    for (let y = 0; y < P; y++) {
      for (let x = 0; x < P; x++) {
        const i = y * P + x;
        const dx = (x + 0.5) / dpr - lensR, dy = (y + 0.5) / dpr - lensR;
        const rd = Math.hypot(dx, dy) / lensR;
        if (rd > 1) { warp[i] = -1; continue; }
        let rs = rd;
        for (let n = 0; n < 5; n++) rs -= (rs * (1 + k * rs * rs) - rd * (1 + k)) / (1 + 3 * k * rs * rs);
        const f = rd > 1e-6 ? rs / rd : 1 + k;
        const vx = Math.floor(D / 2 + (dx * f) / ZOOM), vy = Math.floor(D / 2 + (dy * f) / ZOOM);
        warp[i] = vx >= 0 && vx < D && vy >= 0 && vy < D ? vy * D + vx : -1;
      }
    }

    diag = Math.round(((lensR + RIM) * Math.SQRT1_2 - BLOCK) / BLOCK) * BLOCK;
    LS = C + diag + (HANDLE_STEPS + 5) * BLOCK;

    const frame = new Set<string>();
    const inGlass = (bx: number, by: number) => Math.hypot(bx + 0.5, by + 0.5) * BLOCK < lensR;
    const n = Math.ceil((lensR + RIM) / BLOCK) + 1;
    glass = new Path2D();
    for (let by = -n; by < n; by++) {
      for (let bx = -n; bx < n; bx++) {
        const d = Math.hypot(bx + 0.5, by + 0.5) * BLOCK;
        if (d < lensR) glass.rect(C + bx * BLOCK, C + by * BLOCK, BLOCK, BLOCK);
        else if (d < lensR + RIM) frame.add(`${bx},${by}`);
      }
    }
    const base = diag / BLOCK;
    for (let s = 0; s < HANDLE_STEPS; s++) {
      const wb = s < 3 ? 4 : 3, ob = s < 3 ? 2 : 1;
      for (let i = 0; i < wb; i++)
        for (let j = 0; j < wb; j++) {
          const bx = base + s - ob + i, by = base + s - ob + j;
          if (!inGlass(bx, by)) frame.add(`${bx},${by}`);
        }
    }
    rim = new Path2D();
    edge = new Path2D();
    const edges = new Set<string>();
    for (const key of frame) {
      const [bx, by] = key.split(',').map(Number);
      rim.rect(C + bx * BLOCK, C + by * BLOCK, BLOCK, BLOCK);
      for (const [ex, ey] of [[bx + 1, by], [bx - 1, by], [bx, by + 1], [bx, by - 1]]) {
        const e = `${ex},${ey}`;
        if (!frame.has(e) && !edges.has(e)) {
          edges.add(e);
          edge.rect(C + ex * BLOCK, C + ey * BLOCK, BLOCK, BLOCK);
        }
      }
    }

    lens.width = lens.height = Math.round(LS * dpr);
    lens.style.width = lens.style.height = `${LS}px`;
  };

  let typesetTimer = 0;

  const layout = () => {
    deskW = desk.clientWidth;
    if (!deskW) return;
    dpr = window.devicePixelRatio || 1;
    const wide = deskW > 900;
    pw = Math.round(clamp(deskW * (wide ? 0.3 : 0.62), 200, 520));
    ph = Math.round(pw * PAPER_RATIO);
    W = Math.floor(pw / BASE);
    H = Math.floor(ph / BASE);
    bs = pw / W;
    deskH = Math.round(ph * (wide ? 1.6 : 1.5));
    desk.style.height = `${deskH}px`;
    readAccent();

    clearTimeout(typesetTimer);
    sheets.forEach((s) => s.el.remove());
    sheets = [];
    const r = rng(SEED);
    const n = wide ? DOCS.length : 3;
    const main = Math.floor(n / 2);
    const others = DOCS.slice(1, n);
    const zs = Array.from({ length: n - 1 }, (_, i) => i).sort(() => r() - 0.5);
    let other = 0;

    for (let i = 0; i < n; i++) {
      const isMain = i === main;
      const t = n > 1 ? i / (n - 1) : 0.5;
      const x = isMain ? (deskW - pw) / 2 : -pw * 0.15 + t * (deskW - pw * 0.7) + (r() - 0.5) * pw * 0.2;
      const y = isMain ? (deskH - ph) / 2 : r() * (deskH - ph);
      const rot = isMain ? -2 : (r() * 2 - 1) * MAX_ROT;
      const doc = isMain ? DOCS[0] : others[other];
      const z = isMain ? n : zs[other];

      const el = document.createElement('canvas');
      el.className = 'fine-sheet';
      el.setAttribute('aria-hidden', 'true');
      el.width = W;
      el.height = H;
      el.style.cssText = `left:${x}px;top:${y}px;width:${pw}px;height:${ph}px;transform:rotate(${rot}deg);z-index:${z}`;

      sheets.push({
        el,
        paper: el,
        pctx: el.getContext('2d', { willReadFrequently: true })!,
        x, y, rot, z,
        title: doc.title,
        blocks: doc.blocks,
        page: isMain ? 1 : other + 2,
        ink: null, heat: null, img: null, box: null,
      });
      if (!isMain) other++;
    }
    topZ = n;

    sheets.sort((a, b) => a.z - b.z);
    for (const s of sheets) desk.insertBefore(s.el, lens);
    const queue = [...sheets].reverse();
    const next = () => {
      const s = queue.shift();
      if (!s) return;
      typeset(s);
      draw();
      typesetTimer = window.setTimeout(next, 0);
    };
    next();
    smoke = [];

    buildLens();
    if (!moved) {
      lx = Math.max(C, Math.min(deskW * 0.8, deskW - (LS - C) - BLOCK));
      ly = Math.max(C, Math.min(deskH * 0.62, deskH - (LS - C) - BLOCK));
    }
    lx = clamp(lx, 0, deskW);
    ly = clamp(ly, 0, deskH);
    placeLens();
    draw();
  };

  const placeLens = () => {
    lens.style.transform = `translate(${Math.round(lx - C)}px, ${Math.round(ly - C)}px)`;
  };

  const toPaper = (s: Sheet, x: number, y: number) => {
    const dx = x - (s.x + pw / 2), dy = y - (s.y + ph / 2);
    const c = Math.cos(s.rot * DEG), n = Math.sin(s.rot * DEG);
    return { mx: (dx * c + dy * n + pw / 2) / bs, my: (-dx * n + dy * c + ph / 2) / bs };
  };

  const topAt = (x: number, y: number) => {
    for (let i = sheets.length - 1; i >= 0; i--) {
      const s = sheets[i];
      const { mx, my } = toPaper(s, x, y);
      if (mx >= 0 && my >= 0 && mx < W && my < H) return { s, mx, my };
    }
    return null;
  };

  const hit = (x: number, y: number) => {
    const dx = x - lx, dy = y - ly;
    if (Math.hypot(dx, dy) <= lensR + RIM + BLOCK) return true;
    const along = (dx + dy) / 2;
    return along >= diag - BLOCK && along <= diag + HANDLE_STEPS * BLOCK && Math.abs(dx - dy) <= 5 * BLOCK;
  };

  const local = (e: PointerEvent) => {
    const d = desk.getBoundingClientRect();
    return { x: e.clientX - d.left, y: e.clientY - d.top };
  };

  const settle = (now: number) => {
    phase = 'idle';
    anchorX = lx;
    anchorY = ly;
    stillSince = now;
  };

  const moveTo = (x: number, y: number) => {
    const now = performance.now();
    x = clamp(x, 0, deskW);
    y = clamp(y, 0, deskH);
    const dt = Math.max(1, now - lastMoveT);
    speed = speed * 0.6 + ((Math.hypot(x - lx, y - ly) / dt) * 1000) * 0.4;
    lastMoveT = now;
    lx = x;
    ly = y;
    if (phase === 'burn') {
      if (speed > DRAG_LIMIT || !topAt(lx, ly)) settle(now);
    } else if (Math.hypot(lx - anchorX, ly - anchorY) > STILL_SLOP) {
      settle(now);
    }
    placeLens();
    wake();
  };

  const drawSmoke = (c: CanvasRenderingContext2D) => {
    c.fillStyle = accentCss;
    for (const p of smoke) {
      const s = Math.ceil(p.s * (1 - p.life / p.max));
      if (s > 0) c.fillRect(Math.round(p.x), Math.round(p.y), s, s);
    }
  };

  const drawFocus = (c: CanvasRenderingContext2D, now: number, fx: number, fy: number) => {
    const cx = Math.round(fx), cy = Math.round(fy);
    if (phase === 'gather') {
      const p = clamp((now - phaseAt) / CONVERGE_MS, 0, 1);
      const r = 1.5 + (D * 0.45 - 1.5) * (1 - p) ** 2;
      const n = Math.max(8, Math.round((2 * Math.PI * r) / 3));
      c.fillStyle = accentCss;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        c.fillRect(Math.round(fx + Math.cos(a) * r), Math.round(fy + Math.sin(a) * r), 1, 1);
      }
    } else if (phase === 'burn') {
      c.fillStyle = '#fff';
      for (let k = 0; k < 6; k++) {
        const a = Math.random() * Math.PI * 2;
        const r = burnR * rand(0.55, 0.85);
        c.fillRect(Math.round(fx + Math.cos(a) * r), Math.round(fy + Math.sin(a) * r), 1, 1);
      }
      c.fillStyle = accentCss;
      c.fillRect(cx - 2, cy - 2, 5, 5);
      const L = 3 + (frame % 3);
      c.fillRect(cx, cy - 2 - L, 1, L);
      c.fillRect(cx, cy + 3, 1, L);
      c.fillRect(cx - 2 - L, cy, L, 1);
      c.fillRect(cx + 3, cy, L, 1);
      c.fillStyle = '#fff';
      c.fillRect(cx - 1, cy - 1, 3, 3);
    }
  };

  const drawSheet = (c: CanvasRenderingContext2D, s: Sheet) => {
    const b = BORDER / bs;
    c.save();
    c.translate((s.x + pw / 2) / bs, (s.y + ph / 2) / bs);
    c.rotate(s.rot * DEG);
    c.translate(-W / 2, -H / 2);
    c.fillStyle = accentCss;
    c.fillRect(-b, -b, W + 2 * b, H + 2 * b);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, W, H);
    c.drawImage(s.paper, 0, 0);
    c.restore();
  };

  const draw = (now = performance.now()) => {
    if (!W) return;

    const fx = lx / bs, fy = ly / bs;
    const ox = Math.round(fx - D / 2), oy = Math.round(fy - D / 2);
    const reach = (pw + ph) / 2 + lensR;
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.clearRect(0, 0, D, D);
    vctx.setTransform(1, 0, 0, 1, -ox, -oy);
    vctx.imageSmoothingEnabled = false;
    for (const s of sheets) {
      if (Math.hypot(s.x + pw / 2 - lx, s.y + ph / 2 - ly) < reach) drawSheet(vctx, s);
    }
    drawSmoke(vctx);
    drawFocus(vctx, now, fx, fy);

    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.clearRect(0, 0, LS, LS);
    lctx.save();
    lctx.clip(glass);
    lctx.fillStyle = accentCss;
    lctx.fillRect(0, 0, LS, LS);
    if (outImg) {
      const src = vctx.getImageData(0, 0, D, D).data;
      const o = outImg.data;
      for (let i = 0; i < warp.length; i++) {
        const j = warp[i] * 4, q = i * 4;
        if (j < 0) { o[q + 3] = 0; continue; }
        o[q] = src[j]; o[q + 1] = src[j + 1]; o[q + 2] = src[j + 2]; o[q + 3] = src[j + 3];
      }
      octx.putImageData(outImg, 0, 0);
      lctx.drawImage(out, C - lensR, C - lensR, lensR * 2, lensR * 2);
    }
    lctx.restore();
    lctx.fillStyle = '#fff';
    lctx.fill(rim);
    lctx.fillStyle = accentCss;
    lctx.fill(edge);
  };

  const burn = (s: Sheet, fx: number, fy: number, dt: number, held: number) => {
    burnable(s);
    const heat = s.heat!;
    const R = BURN_R[0] + (BURN_R[1] - BURN_R[0]) * Math.min(1, held / GROW_MS);
    const x0 = Math.max(0, Math.floor(fx - R)), x1 = Math.min(W, Math.ceil(fx + R) + 1);
    const y0 = Math.max(0, Math.floor(fy - R)), y1 = Math.min(H, Math.ceil(fy + R) + 1);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const d = Math.hypot(x + 0.5 - fx, y + 0.5 - fy);
        if (d > R) continue;
        const i = y * W + x;
        heat[i] = Math.min(1.3, heat[i] + HEAT_RATE * dt * (1 - d / R) * rand(0.5, 1.5));
      }
    }
    const b = s.box;
    s.box = b
      ? { x0: Math.min(b.x0, x0), y0: Math.min(b.y0, y0), x1: Math.max(b.x1, x1), y1: Math.max(b.y1, y1) }
      : { x0, y0, x1, y1 };
    repaint(s, x0, y0, x1, y1);
    return R;
  };

  const heal = (dt: number) => {
    for (const s of sheets) {
      const b = s.box;
      if (!b || !s.heat) continue;
      let any = false;
      for (let y = b.y0; y < b.y1; y++) {
        for (let x = b.x0; x < b.x1; x++) {
          const i = y * W + x;
          if (s.heat[i] <= 0) continue;
          s.heat[i] = Math.max(0, s.heat[i] - HEAL_RATE * dt);
          if (s.heat[i] > 0) any = true;
        }
      }
      repaint(s, b.x0, b.y0, b.x1, b.y1);
      if (!any) {
        s.box = null;
        s.img = null;
        s.ink = null;
        s.heat = null;
      }
    }
  };

  const step = (now: number, dt: number) => {
    const under = dragging ? topAt(lx, ly) : null;
    if (under) lensMs += dt * 1000;
    if (now - lastMoveT > 120) speed = 0;

    if (!under) phase = 'idle';
    if (phase === 'idle' && under && now - stillSince > FOCUS_MS) {
      phase = 'gather';
      phaseAt = now;
    }
    if (phase === 'gather' && now - phaseAt > CONVERGE_MS) {
      phase = 'burn';
      phaseAt = now;
      ignitions++;
      sfx.crackle();
    }
    if (phase === 'burn' && under) {
      burnR = burn(under.s, under.mx, under.my, dt, now - phaseAt);
      lastBurnAt = now;
      if (!reduced() && Math.random() < 0.8) {
        smoke.push({
          x: lx / bs + rand(-0.3, 0.3) * burnR,
          y: ly / bs - 2,
          vx: rand(-3, 3),
          vy: -rand(12, 26),
          life: 0,
          max: rand(0.9, 1.7),
          s: 2 + Math.floor(Math.random() * 3),
          seed: Math.random() * 6,
        });
      }
      if (Math.random() < 0.12) sfx.crackle();
    }
    if (now - lastBurnAt > HEAL_DELAY && frame % HEAL_EVERY === 0) heal(dt * HEAL_EVERY);

    smoke = smoke.filter((p) => {
      p.life += dt;
      p.x += (p.vx + Math.sin(p.life * 6 + p.seed) * 4) * dt;
      p.y += p.vy * dt;
      return p.life < p.max;
    });
  };

  const busy = () => dragging || held !== null || phase !== 'idle' || smoke.length > 0 || sheets.some((s) => s.box);

  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / FPS) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    frame++;
    step(now, dt);
    draw(now);
    if (!busy()) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(loop);
  };

  desk.addEventListener('pointerdown', (e) => {
    const p = local(e);
    if (hit(p.x, p.y)) {
      dragging = true;
      moved = true;
      grab = { x: p.x - lx, y: p.y - ly };
      lastMoveT = performance.now();
      settle(lastMoveT);
    } else {
      const el = (e.target as HTMLElement).closest('.fine-sheet');
      const s = sheets.find((x) => x.el === el);
      if (!s) return;
      held = s;
      grab = { x: p.x - s.x, y: p.y - s.y };
      s.z = ++topZ;
      s.el.style.zIndex = String(s.z);
      sheets.sort((a, b) => a.z - b.z);
    }
    e.preventDefault();
    desk.setPointerCapture(e.pointerId);
    desk.classList.add('is-holding');
    sfx.click();
    wake();
  });

  desk.addEventListener('pointermove', (e) => {
    const p = local(e);
    if (dragging) {
      moveTo(p.x - grab.x, p.y - grab.y);
    } else if (held) {
      held.x = clamp(p.x - grab.x, -pw / 2, deskW - pw / 2);
      held.y = clamp(p.y - grab.y, -ph / 2, deskH - ph / 2);
      held.el.style.left = `${held.x}px`;
      held.el.style.top = `${held.y}px`;
      wake();
    } else {
      desk.classList.toggle('is-lens', hit(p.x, p.y));
    }
  });

  const drop = () => {
    if (!dragging && !held) return;
    dragging = false;
    held = null;
    phase = 'idle';
    desk.classList.remove('is-holding');
    sfx.click();
  };
  desk.addEventListener('pointerup', drop);
  desk.addEventListener('pointercancel', drop);
  desk.addEventListener('pointerleave', () => { if (!dragging) desk.classList.remove('is-lens'); });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { last = performance.now(); wake(); }
  }).observe(root);

  let ready = false;
  new ResizeObserver(() => {
    if (ready && (desk.clientWidth !== deskW || (window.devicePixelRatio || 1) !== dpr)) layout();
  }).observe(desk);

  new MutationObserver(() => {
    if (!ready) return;
    readAccent();
    for (const s of sheets) {
      if (s.img) repaint(s, 0, 0, W, H);
      else typeset(s);
    }
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent'] });

  await document.fonts.load(FONT);
  ready = true;
  layout();
}
