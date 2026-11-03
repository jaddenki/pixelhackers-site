import { openCredits } from './credits';

const STORAGE_KEY = 'ph-sound';

const FILES = {
  key: '/audio/key.mp3',
  boom: '/audio/boom.mp3',
  birds: '/audio/birds.mp3',
  music: '/audio/cher.mp3',
  testMusic: '/audio/lingon.mp3',
  globeMusic: '/audio/allen.mp3',
  token: '/audio/token.mp3',
  talk: '/audio/talk.mp3',
  ready: '/audio/ready.mp3',
  credits: '/audio/goodending.mp3',
  bbbLegendary: '/audio/bbb-legendary.mp3',
  bbbDominating: '/audio/bbb-dominating.mp3',
  rLegendary: '/audio/r-legendary.mp3',
  rDominating: '/audio/r-dominating.mp3',
};

let onTrackChange: (() => void) | null = null;

const CHEERS: Name[] = ['bbbLegendary', 'bbbDominating', 'rLegendary', 'rDominating'];
type Track = 'music' | 'testMusic' | 'globeMusic' | 'credits';
type Name = keyof typeof FILES;

type Prefs = { enabled: boolean; music: boolean; volume: number };

let prefs: Prefs = { enabled: false, music: true, volume: 0.35 };
try {
  prefs = { ...prefs, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
} catch {}

const save = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
};

let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;
const active = new Set<AudioBufferSourceNode>();
let musicSrc: AudioBufferSourceNode | null = null;
let playing: Track | null = null;
let track: Track = 'music';
const buffers = new Map<Name, Promise<AudioBuffer>>();

function audio(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function load(name: Name) {
  if (!buffers.has(name)) {
    buffers.set(
      name,
      fetch(FILES[name])
        .then((r) => r.arrayBuffer())
        .then((b) => audio().decodeAudioData(b)),
    );
  }
  return buffers.get(name)!;
}

async function play(name: Name, { volume = 1, rate = 1 } = {}) {
  if (!prefs.enabled) return;
  const ac = audio();
  const buffer = await load(name);
  const src = ac.createBufferSource();
  const gain = ac.createGain();
  src.buffer = buffer;
  src.playbackRate.value = rate;
  gain.gain.value = volume;
  src.connect(gain).connect(ac.destination);
  if (!prefs.enabled) return;
  active.add(src);
  src.onended = () => active.delete(src);
  src.start();
}

function stopEffects() {
  active.forEach((src) => src.stop());
  active.clear();
}

const musicLevel = () => (prefs.enabled && prefs.music ? prefs.volume : 0);

async function syncMusic() {
  if (musicLevel() > 0 && playing !== track) {
    const want = track;
    playing = want;
    const ac = audio();
    if (!musicGain) {
      musicGain = ac.createGain();
      musicGain.connect(ac.destination);
    }
    const buffer = await load(want);
    if (playing !== want) return;
    musicSrc?.stop();
    musicSrc = ac.createBufferSource();
    musicSrc.buffer = buffer;
    musicSrc.loop = want !== 'credits';
    musicSrc.connect(musicGain);
    musicSrc.start();
  }
  if (musicGain && ctx) musicGain.gain.setValueAtTime(musicLevel(), ctx.currentTime);
}

export const getTrack = () => track;

let mainTrack: Track = 'music';

export function setMainTrack(next: Track) {
  mainTrack = next;
  setTrack('music');
}

export function setTrack(next: Track) {
  if (next === 'music') next = mainTrack;
  if (track === next) return;
  track = next;
  onTrackChange?.();
  if (playing) syncMusic();
}

let beforeCredits: Track | null = null;

export function creditsMusic(on: boolean) {
  if (on && track !== 'credits') {
    beforeCredits = track;
    setTrack('credits');
  } else if (!on && beforeCredits) {
    setTrack(beforeCredits);
    beforeCredits = null;
  }
}

const pitch = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

export const sfx = {
  key: () => play('key', { volume: 0.5, rate: pitch(0.75, 1.35) }),
  click: () => play('key', { volume: 0.7, rate: pitch(0.85, 1.2) }),
  talk: () => play('talk', { volume: 0.6, rate: pitch(0.95, 1.1) }),
  heart: () => play('token', { volume: 0.7, rate: pitch(0.9, 1.15) }),
  boom: (power = 0) => play('boom', { volume: 0.7 + 0.3 * power, rate: pitch(0.9, 1.1) * (1 - 0.45 * power) }),
  birds: () => play('birds', { volume: 0.6 }),
  ready: () => play('ready', { volume: 0.9 }),
  cheer: () => play(CHEERS[Math.floor(Math.random() * CHEERS.length)], { volume: 0.9 }),
};

const icon = (d: string) =>
  `<svg viewBox="0 0 12 10" width="36" height="30" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;

const SPEAKER_ON = icon('M0 3h2v4H0zM2 3h1v4H2zM3 2h1v6H3zM4 1h1v8H4zM5 0h1v10H5zM7 3h1v4H7zM9 1h1v1H9zM10 2h1v6h-1zM9 8h1v1H9z');
const SPEAKER_OFF = icon('M0 3h2v4H0zM2 3h1v4H2zM3 2h1v6H3zM4 1h1v8H4zM5 0h1v10H5zM7 3h1v1H7zM8 4h1v1H8zM9 5h1v1H9zM10 6h1v1h-1zM10 3h1v1h-1zM9 4h1v1H9zM7 6h1v1H7zM8 5h1v1H8z');
const NOTE_ON = icon('M4 0h7v2H4zM4 2h1v5H4zM10 2h1v5h-1zM1 6h3v3H1zM2 9h1v1H2zM7 6h3v3H7zM8 9h1v1H8z');
const NOTE_OFF = icon('M4 0h7v2H4zM4 2h1v5H4zM10 2h1v5h-1zM1 6h3v3H1zM7 6h3v3H7zM0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM5 5h1v1H5zM6 6h1v1H6zM9 9h1v1H9zM11 9h1v1h-1z');

export function initSound() {
  const wrap = document.createElement('div');
  wrap.className = 'sound';
  wrap.innerHTML = `
    <button class="sound-credit" type="button">Credits</button>
    <div class="sound-music">
      <input class="sound-volume" type="range" min="0" max="100" step="5" aria-label="Music volume">
      <button class="sound-btn sound-note" type="button"></button>
    </div>
    <button class="sound-btn sound-master" type="button"></button>
  `;

  const master = wrap.querySelector<HTMLButtonElement>('.sound-master')!;
  const note = wrap.querySelector<HTMLButtonElement>('.sound-note')!;
  const volume = wrap.querySelector<HTMLInputElement>('.sound-volume')!;
  const credit = wrap.querySelector<HTMLButtonElement>('.sound-credit')!;
  credit.addEventListener('click', () => { sfx.click(); openCredits(); });
  volume.value = String(Math.round(prefs.volume * 100));

  const render = () => {
    master.innerHTML = prefs.enabled ? SPEAKER_ON : SPEAKER_OFF;
    master.setAttribute('aria-label', prefs.enabled ? 'Mute all sound' : 'Turn sound on');
    master.setAttribute('aria-pressed', String(prefs.enabled));
    note.innerHTML = prefs.music ? NOTE_ON : NOTE_OFF;
    note.setAttribute('aria-label', prefs.music ? 'Turn music off' : 'Turn music on');
    note.setAttribute('aria-pressed', String(prefs.music));
    wrap.classList.toggle('is-on', prefs.enabled);
    wrap.classList.toggle('is-playing', musicLevel() > 0);
  };

  const update = (patch: Partial<Prefs>) => {
    prefs = { ...prefs, ...patch };
    if (!prefs.enabled) stopEffects();
    save();
    render();
    syncMusic();
  };

  master.addEventListener('click', () => { update({ enabled: !prefs.enabled }); sfx.click(); });
  note.addEventListener('click', () => { update({ music: !prefs.music }); sfx.click(); });
  volume.addEventListener('input', () => {
    const v = Number(volume.value) / 100;
    update({ volume: v, music: v > 0 });
  });

  onTrackChange = render;
  render();
  document.body.appendChild(wrap);

  const resume = () => syncMusic();
  document.addEventListener('pointerdown', resume, { once: true });
  document.addEventListener('keydown', resume, { once: true });

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('.cta-primary')) sfx.boom();
    else if (t.closest('.cta-btn')) sfx.click();
    else if (t.closest('.hero')) sfx.birds();
  });

  document.addEventListener('input', (e) => {
    const ie = e as InputEvent;
    if ((e.target as HTMLElement).isContentEditable && ie.inputType?.startsWith('insert')) sfx.key();
  });
}
