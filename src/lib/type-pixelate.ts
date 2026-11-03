const MODULE_EM = 0.05;
const EM_MODULES = 20;
const ASCENT_MODULES = 16;
const LEVELS = [4, 2];

const sampler = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;

function bitmap(ch: string, cols: number) {
  sampler.canvas.width = cols;
  sampler.canvas.height = EM_MODULES;
  sampler.font = `500 ${EM_MODULES}px PixelHackers`;
  sampler.textBaseline = 'alphabetic';
  sampler.fillText(ch, 0, ASCENT_MODULES);
  const data = sampler.getImageData(0, 0, cols, EM_MODULES).data;
  const ink: boolean[] = [];
  for (let i = 0; i < cols * EM_MODULES; i++) ink.push(data[i * 4 + 3] > 127);
  return ink;
}

function frame(ink: boolean[], cols: number, block: number, color: string, m: number) {
  const c = document.createElement('canvas');
  const w = Math.ceil(cols / block) * block;
  c.width = w;
  c.height = EM_MODULES;
  c.style.width = `${w * m}px`;
  c.style.height = `${EM_MODULES * m}px`;
  const g = c.getContext('2d')!;
  g.fillStyle = color;
  for (let by = 0; by < EM_MODULES; by += block) {
    for (let bx = 0; bx < cols; bx += block) {
      let hit = false;
      for (let y = by; y < by + block && !hit; y++)
        for (let x = bx; x < bx + block && !hit; x++)
          hit = x < cols && ink[y * cols + x];
      if (hit) g.fillRect(bx, by, block, block);
    }
  }
  return c;
}

function backgroundOf(el: HTMLElement): string {
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    if (bg && bg !== 'transparent' && !bg.endsWith(', 0)')) return bg;
  }
  return '#fff';
}

export function pixelateIn(el: HTMLElement, ch: string, r: DOMRect) {
  if (!ch || /\s/.test(ch) || reduced()) return;

  const style = getComputedStyle(el);
  const m = parseFloat(style.fontSize) * MODULE_EM;
  const cols = Math.max(1, Math.ceil(r.width / m));
  const ink = bitmap(ch, cols);

  const overlay = document.createElement('div');
  overlay.className = 'px-in';
  overlay.style.left = `${r.left + scrollX}px`;
  overlay.style.top = `${r.top + scrollY}px`;
  overlay.style.width = `${r.width}px`;
  overlay.style.height = `${r.height}px`;
  overlay.style.background = backgroundOf(el);

  for (const block of LEVELS) overlay.prepend(frame(ink, cols, block, style.color, m));

  overlay.addEventListener('animationend', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

function pop(el: HTMLElement, node: Text, index: number) {
  const ch = node.data[index];
  if (!ch) return;
  const range = document.createRange();
  range.setStart(node, index);
  range.setEnd(node, index + 1);
  const rects = range.getClientRects();
  const r = rects[rects.length - 1];
  if (r) pixelateIn(el, ch, r);
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initTypePixelate() {
  document.addEventListener('input', (e) => {
    const ie = e as InputEvent;
    const el = e.target as HTMLElement;
    if (!el.isContentEditable || ie.inputType !== 'insertText' || !ie.data) return;

    const sel = getSelection();
    const node = sel?.focusNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return;

    const end = sel!.focusOffset;
    const len = ie.data.length;
    for (let i = end - len; i < end; i++) pop(el, node as Text, i);
  });
}
