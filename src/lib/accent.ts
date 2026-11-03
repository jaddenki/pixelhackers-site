import { sfx } from './sound';

const KEY = 'ph-accent';
const SWATCHES = [
  { id: 'blue', color: '#0000ff', label: 'Blue' },
  { id: 'pink', color: '#FF4C9C', label: 'Pink' },
] as const;

export function initAccent() {
  const root = document.documentElement;
  const wrap = document.createElement('div');
  wrap.className = 'accent';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Accent color');

  const render = () => {
    const current = root.dataset.accent ?? 'blue';
    for (const { id, b } of btns) b.setAttribute('aria-pressed', String(id === current));
  };

  const set = (id: string) => {
    if (id === 'blue') delete root.dataset.accent;
    else root.dataset.accent = id;
    try { localStorage.setItem(KEY, id); } catch {}
    render();
  };

  const btns = SWATCHES.map(({ id, color, label }) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'accent-btn';
    b.style.setProperty('--swatch', color);
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      set(id);
      sfx.click();
    });
    wrap.appendChild(b);
    return { id, b };
  });

  render();
  document.body.appendChild(wrap);
}
