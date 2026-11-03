import { sfx } from './sound';
import { pixelateIn } from './type-pixelate';

const CELL = 6;
const FPS = 10;
const DECAY = 0.005;
const DRY_MS: [number, number] = [18000, 36000];
const HEAL_MS: [number, number] = [500, 1400];
const SIGN_CHAR_MS = 45;
const SIGNS: [number, string][] = [
  [1, 'Wet paint'],
  [3, 'Still wet'],
  [5, 'Yep, wet'],
  [8, 'Very wet'],
  [12, 'Please stop'],
  [20, 'Welcome, Pixel Hacker'],
];

type Cell = { white: boolean; dies: number };

let touches = 0;
export const wetTouched = () => touches > 0;

const between = ([lo, hi]: [number, number]) => lo + Math.random() * (hi - lo);

function backgroundOf(el: Element | null): string {
  for (let n = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    if (bg && bg !== 'transparent' && !bg.endsWith(', 0)')) return bg;
  }
  return 'rgb(255, 255, 255)';
}

const rgbKey = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).join(',');

export function initWetPaint(box: HTMLElement) {
  const canvas = document.createElement('canvas');
  canvas.className = 'paint';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const cells = new Map<string, Cell>();
  let paint = 0;
  let last: { x: number; y: number } | null = null;
  let pressingBox = false;
  let ticking = false;
  let queued = false;

  let sized = false;
  const fit = () => {
    if (!cells.size) {
      if (canvas.width) canvas.width = canvas.height = 0;
      sized = false;
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sized = true;
    draw();
  };

  const draw = () => {
    if (!sized) { if (cells.size) fit(); return; }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (!cells.size) return;
    const accent = getComputedStyle(canvas).color;
    const x0 = Math.floor(scrollX / CELL) - 1;
    const y0 = Math.floor(scrollY / CELL) - 1;
    const x1 = x0 + Math.ceil(innerWidth / CELL) + 2;
    const y1 = y0 + Math.ceil(innerHeight / CELL) + 2;
    for (const [key, c] of cells) {
      const [cx, cy] = key.split(',').map(Number);
      if (cx < x0 || cx > x1 || cy < y0 || cy > y1) continue;
      ctx.fillStyle = c.white ? '#fff' : accent;
      ctx.fillRect(cx * CELL - scrollX, cy * CELL - scrollY, CELL, CELL);
    }
  };

  const tick = () => {
    const now = performance.now();
    for (const [key, c] of cells) if (c.dies <= now) cells.delete(key);
    draw();
    if (cells.size) setTimeout(tick, 1000 / FPS);
    else { ticking = false; fit(); }
  };

  const wake = () => {
    if (!ticking) { ticking = true; setTimeout(tick, 1000 / FPS); }
  };

  const queueDraw = () => {
    if (queued || !cells.size) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; draw(); });
  };

  const stamp = (x: number, y: number, white: boolean, life: [number, number], density: number) => {
    const gx = Math.round((x + scrollX) / CELL);
    const gy = Math.round((y + scrollY) / CELL);
    const now = performance.now();
    for (let dy = 0; dy < 2; dy++)
      for (let dx = -1; dx < 1; dx++) {
        if (Math.random() > density) continue;
        cells.set(`${gx + dx},${gy + dy}`, { white, dies: now + between(life) });
      }
  };

  const sign = document.createElement('div');
  sign.className = 'wet-sign';
  sign.setAttribute('role', 'status');
  let signTimers: number[] = [];

  const showSign = (text: string) => {
    signTimers.forEach(clearTimeout);
    signTimers = [];
    if (!sign.isConnected) box.appendChild(sign);
    box.classList.add('has-sign');
    sign.setAttribute('aria-label', text);
    sign.textContent = '';
    const spans = [...text].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.visibility = 'hidden';
      s.setAttribute('aria-hidden', 'true');
      sign.appendChild(s);
      return s;
    });
    spans.forEach((s, i) => {
      signTimers.push(window.setTimeout(() => {
        s.style.visibility = '';
        pixelateIn(sign, s.textContent!, s.getBoundingClientRect());
        if (s.textContent !== ' ') sfx.talk();
      }, i * SIGN_CHAR_MS));
    });
  };

  box.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    touches++;
    paint = 1;
    pressingBox = true;
    last = { x: e.clientX, y: e.clientY };
    stamp(e.clientX, e.clientY, true, HEAL_MS, 1);
    sfx.click();
    wake();
    draw();
    const msg = SIGNS.find(([n]) => n === touches)?.[1];
    if (msg) showSign(msg);
  });

  const release = () => { pressingBox = false; };
  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);

  document.addEventListener('pointermove', (e) => {
    const from = last;
    last = { x: e.clientX, y: e.clientY };
    if (!from || (paint <= 0 && !pressingBox)) return;

    const under = document.elementFromPoint(e.clientX, e.clientY);
    const inBox = !!under?.closest('.desc-right');
    if (inBox && !pressingBox) return;
    const white = inBox || rgbKey(backgroundOf(under)) === rgbKey(getComputedStyle(canvas).color);

    const dist = Math.hypot(last.x - from.x, last.y - from.y);
    const n = Math.max(1, Math.floor(dist / CELL));
    for (let i = 1; i <= n; i++) {
      const x = from.x + ((last.x - from.x) * i) / n;
      const y = from.y + ((last.y - from.y) * i) / n;
      if (inBox) {
        stamp(x, y, true, HEAL_MS, 1);
      } else {
        if (paint <= 0) break;
        stamp(x, y, white, DRY_MS, 0.3 + 0.7 * paint);
        paint -= DECAY;
      }
    }
    wake();
    draw();
  });

  addEventListener('scroll', queueDraw, { passive: true });
  addEventListener('resize', fit);
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent'] });
  fit();
}
