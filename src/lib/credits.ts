import { creditsMusic } from './sound';

const ROLES: [string, string, string?][] = [
  ['Website', 'Jadden'],
  ['Font', 'Jadden'],
  ['Mon Cheri', 'Mason'],
  ['Ready Set Jam', 'Saahil'],
  ['Spread the Love (SOS Reprise)', 'Mason'],
  ['Voiceovers', 'Jadden, Saahil', '(Sounds are from the game Spread the Love on Steam)'],
  ['Encouragement', 'Purdue Hackers'],
];

const SPOTIFY = 'https://open.spotify.com/album/4j2GQCCY2B4wLjjo2xeDY1?si=QIWpoHUcSRCM28gJUEpgiQ';
const ROLL_MS = 24600;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

let open = false;

export function openCredits() {
  if (open) return;
  open = true;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const returnFocus = document.activeElement as HTMLElement | null;

  const overlay = document.createElement('div');
  overlay.className = 'credits';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Credits');
  overlay.tabIndex = -1;
  overlay.innerHTML = `<div class="credits-roll">${ROLES.map(
    ([role, name, note]) => `
      <div class="credits-item">
        <div class="credits-role">${role}</div>
        <div class="credits-name">${name}</div>
        ${note ? `<div class="credits-note">${note}</div>` : ''}
      </div>`,
  ).join('')}
    <a class="credits-link" href="${SPOTIFY}" target="_blank" rel="noopener">All the songs are on Spotify</a>
  </div>`;
  if (reduce) overlay.classList.add('is-static');

  document.body.appendChild(overlay);
  overlay.focus();
  creditsMusic(true);

  const roll = overlay.querySelector<HTMLElement>('.credits-roll')!;
  let scroll: Animation | null = null;

  overlay.animate(
    reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
    { duration: reduce ? 150 : 450, easing: EASE },
  );

  if (!reduce) {
    const from = window.innerHeight;
    const link = roll.querySelector<HTMLElement>('.credits-link')!;
    const to = window.innerHeight / 2 - (link.offsetTop + link.offsetHeight / 2);
    scroll = roll.animate(
      [{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }],
      { duration: ROLL_MS, easing: 'cubic-bezier(0.33, 0.33, 0.4, 1)', fill: 'forwards' },
    );
  }

  function close() {
    if (!open) return;
    open = false;
    document.removeEventListener('keydown', onKey);
    scroll?.pause();
    creditsMusic(false);
    overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' })
      .onfinish = () => {
        overlay.remove();
        returnFocus?.focus();
      };
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  overlay.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.credits-link')) close();
  });
  document.addEventListener('keydown', onKey);
}
