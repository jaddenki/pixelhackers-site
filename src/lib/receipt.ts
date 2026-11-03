import { sfx } from './sound';
import { wetTouched } from './wet-paint';

const LINE = 30;
const FEED_MS = 55;
const DROP_MS = 50;
const GLYPHS = 458;
const ORDER_KEY = 'ph-orders';
const BAR_UNITS = 60;

let wpm: number | null = null;
let world: string | null = null;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const row = (l: string, r: string) => `<div class="receipt-row"><span>${esc(l)}</span><span>${esc(r)}</span></div>`;
const rule = '<div class="receipt-rule"></div>';

function barcode(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => ((h = Math.imul(h ^ (h >>> 13), 1274126177)) >>> 0) / 2 ** 32;
  let x = 0;
  let rects = '';
  let bar = true;
  while (x < BAR_UNITS) {
    const w = Math.min(BAR_UNITS - x, 1 + Math.floor(rand() * 3));
    if (bar) rects += `<rect x="${x}" y="0" width="${w}" height="8"/>`;
    x += w;
    bar = !bar;
  }
  return `<svg viewBox="0 0 ${BAR_UNITS} 8" width="${BAR_UNITS * 6}" height="48" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${rects}</svg>`;
}

function nextOrder() {
  let n = 0;
  try {
    n = Number(localStorage.getItem(ORDER_KEY) ?? 0) + 1;
    localStorage.setItem(ORDER_KEY, String(n));
  } catch {}
  return `#${String(n || 1).padStart(4, '0')}`;
}

export function initReceipt(button: HTMLAnchorElement, github: HTMLAnchorElement) {
  document.addEventListener('wpm:done', (e) => { wpm = (e as CustomEvent<number>).detail; });
  document.addEventListener('globe:choice', (e) => {
    world = (e as CustomEvent<string>).detail === 'yes' ? 'Nuked' : 'Loved';
  });

  const bytes = Number(button.dataset.bytes ?? 0);
  let current: { el: HTMLElement; timers: number[] } | null = null;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tear = () => {
    if (!current) return;
    const { el, timers } = current;
    current = null;
    timers.forEach(clearTimeout);
    document.removeEventListener('keydown', onKey);
    if (reduced()) return el.remove();
    sfx.click();
    let y = Number(el.dataset.y ?? 0);
    let step = LINE;
    const fall = () => {
      y += step;
      step *= 2;
      el.style.transform = `translateY(${y}px)`;
      if (y < el.offsetHeight) setTimeout(fall, DROP_MS);
      else el.remove();
    };
    fall();
  };

  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') tear(); };

  const print = () => {
    tear();
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const order = nextOrder();

    const el = document.createElement('div');
    el.className = 'receipt';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Receipt');
    el.innerHTML = `
      <div class="receipt-head">PixelHackers</div>
      ${row(`${date} ${time}`, order)}
      ${rule}
      ${row('PixelHackers.woff2', '$0.00')}
      ${row('File size', bytes ? `${(bytes / 1024).toFixed(1)} KB` : '?? KB')}
      ${row('Glyphs', String(GLYPHS))}
      ${row('Curves', '0')}
      ${rule}
      ${row('Wet paint touched', wetTouched() ? 'Yes' : 'No')}
      ${row('Your WPM', wpm === null ? 'Untested' : String(wpm))}
      ${row('The world', world ?? 'Unchanged')}
      ${rule}
      ${row('Total', 'Free')}
      <a class="receipt-code" href="${github.href}" aria-label="GitHub">${barcode(order + date + time)}</a>
      <div class="receipt-thanks">Thank you, come again</div>
      <button class="receipt-tear" type="button">Tear off</button>
    `;
    el.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('.receipt-code')) tear();
    });
    document.body.appendChild(el);

    const place = () => {
      el.style.left = `${Math.round((innerWidth - el.offsetWidth) / 2)}px`;
    };
    place();

    const h = el.offsetHeight;
    const timers: number[] = [];
    current = { el, timers };
    document.addEventListener('keydown', onKey);

    const feed = (y: number) => {
      el.dataset.y = String(y);
      el.style.transform = `translateY(${y}px)`;
    };

    if (reduced()) return feed(0);

    const steps = Math.ceil(h / LINE);
    feed(steps * LINE);
    for (let i = 1; i <= steps; i++) {
      timers.push(window.setTimeout(() => {
        feed((steps - i) * LINE);
        sfx.key();
      }, i * FEED_MS));
    }
  };

  button.addEventListener('click', print);
}
