import { sfx } from './sound';
import { pixelateIn } from './type-pixelate';

const ERASE_MS = 40;
const TYPE_MS = 70;

const LINES: Record<string, string> = {
  yes: 'I’m going to\nNUKE the world',
  no: 'I’m going to\nLOVE the world',
};

function retype(el: HTMLElement, target: string) {
  const current = el.textContent ?? '';
  let keep = 0;
  while (keep < current.length && current[keep] === target[keep]) keep++;
  const suffix = target.slice(keep);
  const tail = current.slice(keep);
  const sameEnd = (() => {
    let n = 0;
    while (n < tail.length && n < suffix.length && tail[tail.length - 1 - n] === suffix[suffix.length - 1 - n]) n++;
    return n;
  })();
  const erase = tail.length - sameEnd;
  const insert = suffix.slice(0, suffix.length - sameEnd);
  const after = tail.slice(tail.length - sameEnd);

  let text = current;
  for (let i = 1; i <= erase; i++) {
    setTimeout(() => {
      text = current.slice(0, keep) + tail.slice(0, erase - i) + after;
      el.textContent = text;
      sfx.key();
    }, i * ERASE_MS);
  }

  for (let i = 1; i <= insert.length; i++) {
    setTimeout(() => {
      el.textContent = current.slice(0, keep) + insert.slice(0, i) + after;
      const node = el.firstChild as Text | null;
      const ch = insert[i - 1];
      if (!node || /\s/.test(ch)) return;
      const range = document.createRange();
      range.setStart(node, keep + i - 1);
      range.setEnd(node, keep + i);
      const rects = range.getClientRects();
      if (rects.length) pixelateIn(el, ch, rects[rects.length - 1]);
      sfx.key();
    }, erase * ERASE_MS + 300 + i * TYPE_MS);
  }
}

export function initRetype(el: HTMLElement) {
  document.addEventListener('globe:choice', (e) => {
    const line = LINES[(e as CustomEvent<string>).detail];
    if (line) retype(el, line);
  });
}
