import { sfx } from './sound';

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const DURATION = 10000;
const SCRAMBLE_FRAMES = 4;
const FRAME_MS = 70;
const SKIP = 'script, style, input, textarea, .sound, .globe-quip';

function accentRgb() {
  const probe = document.createElement('span');
  probe.style.color = 'var(--accent)';
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\d+/g)!.slice(0, 3).join(',');
  probe.remove();
  return rgb;
}

function textNodes() {
  const out: Text[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      !n.textContent?.trim() || n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  while (walker.nextNode()) out.push(walker.currentNode as Text);
  return out;
}

export function initBinary() {
  let progress = 0;
  let active = false;

  const run = () => {
    active = true;
    const accent = accentRgb();
    const nodes = textNodes().map((node) => {
      const m = getComputedStyle(node.parentElement!).color.match(/[\d.]+/g) ?? [];
      const colored = m.slice(0, 3).join(',') === accent && (m[3] === undefined || Number(m[3]) > 0);
      return { node, original: node.data, bit: colored ? '1' : '0' };
    });
    const editables = Array.from(document.querySelectorAll<HTMLElement>('[contenteditable]')).map((el) => {
      const value = el.getAttribute('contenteditable')!;
      el.setAttribute('contenteditable', 'false');
      return { el, value };
    });
    document.documentElement.classList.add('is-binary');

    const render = (scramble: number, toBinary: boolean) => {
      for (const n of nodes) {
        n.node.data = n.original.replace(/\S/g, (ch) => {
          if (Math.random() < scramble) return Math.random() < 0.5 ? '0' : '1';
          return toBinary ? n.bit : ch;
        });
      }
    };

    const animate = (toBinary: boolean, done?: () => void) => {
      for (let f = 0; f <= SCRAMBLE_FRAMES; f++) {
        setTimeout(() => {
          const k = f / SCRAMBLE_FRAMES;
          render(toBinary ? 1 - k : k === 1 ? 0 : 1 - k * 0.5, toBinary);
          sfx.click();
          if (f === SCRAMBLE_FRAMES) done?.();
        }, f * FRAME_MS);
      }
    };

    animate(true);
    setTimeout(() => {
      animate(false, () => {
        nodes.forEach((n) => (n.node.data = n.original));
        editables.forEach(({ el, value }) => el.setAttribute('contenteditable', value));
        document.documentElement.classList.remove('is-binary');
        active = false;
      });
    }, DURATION);
  };

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.isContentEditable || t.closest('input, textarea')) { progress = 0; return; }
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === CODE[progress]) progress++;
    else if (key === CODE[0]) progress = progress === 2 ? 2 : 1;
    else progress = 0;
    if (progress === CODE.length) {
      progress = 0;
      if (!active) run();
    }
  });
}
