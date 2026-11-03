import { pixelateIn } from './type-pixelate';

const START_DELAY = 500;
const CHAR_DELAY = 90;

export async function initHeroType(hero: HTMLElement) {
  const chars: HTMLSpanElement[] = [];

  hero.querySelectorAll<HTMLElement>('.hero-line').forEach((line) => {
    const text = line.textContent ?? '';
    line.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.visibility = 'hidden';
      line.appendChild(span);
      chars.push(span);
    }
  });

  await document.fonts.load('500 256px PixelHackers');

  chars.forEach((c, i) => {
    setTimeout(() => {
      c.style.visibility = '';
      pixelateIn(c.parentElement!, c.textContent!, c.getBoundingClientRect());
    }, START_DELAY + i * CHAR_DELAY);
  });
}
