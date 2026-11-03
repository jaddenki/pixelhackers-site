import { sfx } from './sound';

const KEY = 'ph-accent';

export function initAccent() {
  const root = document.documentElement;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'accent-btn';

  const render = () => {
    btn.setAttribute('aria-label', root.dataset.accent === 'pink' ? 'Switch to blue' : 'Switch to pink');
  };

  btn.addEventListener('click', () => {
    const next = root.dataset.accent === 'pink' ? 'blue' : 'pink';
    if (next === 'blue') delete root.dataset.accent;
    else root.dataset.accent = next;
    try { localStorage.setItem(KEY, next); } catch {}
    render();
    sfx.click();
  });

  render();
  (document.querySelector('.sound') ?? document.body).appendChild(btn);
}
