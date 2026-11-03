import { sfx, getTrack, setTrack, setMainTrack } from './sound';
import { pixelateIn } from './type-pixelate';

const MAP_W = 384;
const MAP_H = 192;
const MAP = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007fffe00000ffffff000000000000000000000000000000000000000000000000000000000000000000000000000001fffffff0fef9fffde100000000000000000000000000000000000000000000000000000000000000000000000000001cffffff1fffffffffffffc00000000000000000000000000006000000000000000000000000000000000000000000007ffffff8fffffffffffff0000000001ff800003000000000001fc00000000000000000000000000000000000000001800ff7fe00fffffffffffff00000000ffc0000000000000000000fec000000000000000000000000000000000000000019c39ffe3fffffffffffffe000000007f3800000000000000000001f000000000000000000000000000000000000f00000003ff001fffffffffffff000000001e00000000000000000000007800000000000000000000000000000000003c4300e3e1ce003ffffffffffffc0000000000000000000000f800000007fff00000000000000000000000000000000001ffe0f27ffc000003fffffffffe000000000000000000007e0000000ffffffc000003fe000000000000000000000000001800000fe8000001fffffffffe00000000000000000001e0000000ffffffc000000000000000000000000000000000ff0030f3e313800000fffffffffc000000000000000000038000003ffffffffbe1800038000000000000000000000001fbfb71fb0f7c0000003ffffffff00000000000000000000f0003803ffffffffffff80078000000000000000000000003f7fff07b0ffff800007ffffffff00000000000000000001e000797fffffffffffff8407ff00000000000003ec000000003fff807c7ffff800027ffffffb8000000000003f0000007801f9ffffffffffffffffffffffc0000000003fffff801d801ffff13c04e7ff0003bffffffe000000000007ff8000000000fdffffffffffffffffffffffc003b00000ffffffffffffe1f0605ec783fe00007ffffff000000000003fffff0000007c7cfffffffffffffffffffffffff3ffe000fffffffffffff807c1bfcf833fc001fffffc000000000000ffffffe1c7fffffcfffffffffffffffffffffffffffff8003fffffffffffffffffffff803ff001fffff0000000000001fffffff19ffffff9ffffffffffffffffffffffffffffffe3bffffffffffffffffffff0007e7c01ffffc0019f00000007fffff8cfffffffffffffffffffffffffffffffffffff0f03ffffffffffffffffffffec07ff1000fff80000ff8000000ffe1ff81fffffffffffffffffffffffffffffffffffff00000fffffffffffffffffffcf803fc000fff80000fe0000001ffc7ffcfffffffffffffffffffffffffffffffffffffc00303ffffffffffffffffffe00001ee0007ff00000000000007ff1fffffffffffffffffffffffffffffffffffffffffe0000fffffffffffffffffff801064380001fe0000000000003ffe1fffffffffffffffffffffffffffffffffffffdfff00001fffffffffffffffffff00007f000001fc0000000000007ffc1fffffffffffffffffffffffffffffffffffe39ff800000ffffcfffffffffffffe00007fc000001c0000000000003ffe0fbfffffffffffffffffffffffffffffffffc07fc0000001ff3001fffffffffffe00007fc30000000000000000003fff013fffffffffffffffffffffffffffffffe781c0000000002f00007fffffffffff80007fe780000000000000008038fc07ffffffffffffffffffffffffffffffe0000380000000000cc00007ffffffffff80003fffc000000000000003c000fc03ffffffffffffffffffffffffffffff80001fc00000000030000003fffffffffff8003fffc0000000000000038006783fffffffffffffffffffffffffffffff00003fc000000001c0000001ffffffffffff003fffe000000000000003c006a01ffffffffffffffffffffffffffffffc00003f8000000004000000007ffffffffffff1fffffc00000000000019e006007ffffffffffffffffffffffffffffff000003f8000000000000000027ffffffffffff0fffffe000000000000387007fffffffffffffffffffffffffffffffffec0003e0000000000000000003ffffffffffff8ffffff80000000000039f07ffffffffffffffffffffffffffffffffffff800380000000000000000000ffffffffffff8ffffff00000000000031fcfffffffffffffffffffffffffffffffffffff800180000000000000000000ffffffffffffffffff900000000000001fbffffffffffffffffffffffffffffffffffffc800000000000000000000001ffffffffffffffff8630000000000000207ffffffffffffffffffffffffffffffffffffcc000000000000000000000002ffffffffffffffe243e00000000000003fffffffffffffffffffffffffffffffffffffdc0000000000000000000000017fffffffffffffde07e0000000000001ffffffffffffffffffffffffffffffffffffff90000000000000000000000001ffffffffffffffbe00700000000000007fffffffffffffffffffffffffffffffffffff18000000000000000000000000fffffffffffffffed0000000000000003ffffffffbc7fffffffffffffffffffffffffe10000000000000000000000000ffffffffffffffffe0000000000000001fff9ffff1cffffffffffffffffffffffffffc10000000000000000000000000fffffffffffffff300000000000000001fff8fffe08ffffffffffffffffffffffffff818000000000000000000000000ffffffffffffff8000000000000000183ff1c7ffc003fffffffffffffffffffffffff01e000000000000000000000001ffffffffffffff00000000000000003ffe04e1ffc000ffffffffffffffffffffffff0078000000000000000000000000ffffffffffffff80000000000000003ffe04787fc3c0fffffffffffffffffffffffc0060000000000000000000000001fffffffffffffe00000000000000001ff8041e7c9ffffffffffffffffffffffffbfc0060000000000000000000000000fffffffffffff800000000000000003ff0040570fffffffffffffffffffffffff3700060000000000000000000000000ffffffffffffd000000000000000003ff00004387fffffffffffffffffffffffc03800600000000000000000000000007fffffffffffd000000000000000001fe000701cffffffffffffffffffffffffc07800c00000000000000000000000003fffffffffffe000000000000000001fc03610107ffffffffffffffffffffffffe1c01c00000000000000000000000003fffffffffffe00000000000000000000ffe0000003ffffffffffffffffffffff81c07c00000000000000000000000001fffffffffffe0000000000000000007ffff0003013fffffffffffffffffffffe01c7fc000000000000000000000000007ffffffffff80000000000000000007fffe0000003ffffffffffffffffffffff000cc0000000000000000000000000001ffffffffff0000000000000000001fffff0000003ffffffffffffffffffffff803c00000000000000000000000000001fffffffffc0000000000000000003ffffff038007ffffffffffffffffffffff8010000000000000000000000000000009ffffffff80000000000000000003ffffff87f8c7ffffffffffffffffffffffc01000000000000000000000000000000dffffffff80000000000000000003fffffff7ffffffffffffffffffffffffff8000000000000000000000000000000004ffffe38180000000000000000007ffffffffffffffe3ffffffffffffffffffc0000000000000000000000000000000027fffc000c000000000000000000ffffffffffffffff3ffffffffffffffffffc0000000000000000000000000000000073fff0000c000000000000000003ffffffffffff3fff0ffffffffffffffffff80000000000000000000000000000000019fff0000ec00000000000000007ffffffffffff1fff867ffffffffffffffff00000000000000000000000000000000009fff0000600000000000000000fffffffffffff9fffe07ffffffffffffffff0000000000000000000000000000000000c7ff0000080000000000000000fffffffffffff8fffe3001fffffffffffffe400000000000000000000000000000000023ff0000000000000000000001fffffffffffffc7ffff800fffffffffffffcc00000000000000000000000000000000001ff0001c00000000000000001fffffffffffffc7ffffe003ffffffffffff0800000000000000000000000000000000001ff0000380000000000000003fffffffffffffe3fffff003fffff3fffff80000000000000000000000080000000000000ff00e00e0000000000000003ffffffffffffff3ffffe001bfff83fffc400000000000000000000000000000000000001ff81e0078000000000000001ffffffffffffff1ffffc0003fff01fff8000000000000000000000000000000000000000ff81e0003c00000000000001ffffffffffffff0ffffc0003ffc00fff8c000000000000000000000000000000000000003fefc00c70c0000000000001ffffffffffffff8ffff00003ffc007ff80004000000000000000000000000000000000000fffc0000000000000000001ffffffffffffff87ffe00003ff0007ffc000e0000000000000000000000000000000000001ffc0000000000000000003ffffffffffffffc3ff000003fe0006ffe000c000000000000000000000000000000000000007fe000000000000000003ffffffffffffffc3fe000001f80000fff000c000000000000000000000000000000000000003fe000000000000000007fffffffffffffff3f8000001f80000fff000c000000000000000000000000000000000000000fe000000000000000003fffffffffffffffbe0000000fc00007ff80030000000000000000000000000000000000000001e000000000000000003fffffffffffffffe00000000f800006ff80000000000000000000000000000000000000000000e001400000000000001fffffffffffffffc02000000f8000043f00004000000000000000000000000000000000000000600fe02000000000000fffffffffffffffe7c00000078000043e00130000000000000000000000000000000000000000301effc0000000000007ffffffffffffffffc00000070000040c002100000000000000000000000000000000000000001abfffe0000000000003ffffffffffffffffc0000002400006080040600000000000000000000000000000000000000004fffff8000000000003ffffffffffffffff80000000600002000003e000000000000000000000000000000000000000007ffffc000000000001ffffffffffffffff80000000600003000000e000000000000000000000000000000000000000007ffffe0000000000007ffc7fffffffffff000000000000018000c04000000000000000000000000000000000000000007ffffff000000000003ee03fffffffffff00000000000031c001e00000000000000000000000000000000000000000007ffffff80000000000000007fffffffffe00000000000039c003c00000000000000000000000000000000000000000007ffffffc0000000000000003fffffffffc0000000000000cc00780000000000000000000000000000000000000000000fffffffc0000000000000003fffffffff80000000000000e601fc0000000000000000000000000000000000000000000fffffffe0000000000000003fffffffff000000000000007a0ffc0480000000000000000000000000000000000000001fffffffc0000000000000003ffffffffc000000000000003c0ffcf880000000000000000000000000000000000000003ffffffff0000000000000003ffffffff8000000000000001c0ff80084000000000000000000000000000000000000003fffffffff000000000000003ffffffff8000000000000001e07f1e00e000000000000000000000000000000000000003fffffffff800000000000003fffffffe0000000000000000f07f1c000780000000000000000000000000000000000003ffffffffffc0000000000001fffffffe00000000000000007817163e37f0000000000000000000000000000000000007fffffffffff0000000000000fffffffc0000000000000000780002000ffe000000000000000000000000000000000007fffffffffffc0000000000007ffffffc00000000000000001800120001ff040000000000000000000000000000000007fffffffffffe0000000000007ffffff800000000000000000600000010ff984000000000000000000000000000000001fffffffffffe0000000000003ffffffc000000000000000007f0000000ff801000000000000000000000000000000001fffffffffffe0000000000003ffffffc0000000000000000007e000001f9c00000000000000000000000000000000000fffffffffffe0000000000003ffffffc0000000000000000000040600038e00000000000000000000000000000000000fffffffffffc0000000000003ffffffe00000000000000000000188000007001000000000000000000000000000000007ffffffffff80000000000001ffffffe00000000000000000000000000000000800000000000000000000000000000007ffffffffff00000000000001ffffffe00000000000000000000000040100000000000000000000000000000000000003fffffffffe00000000000003ffffffe008000000000000000000001fc180000000000000000000000000000000000001fffffffffe00000000000007ffffffe008000000000000000000001f8180000000000000000000000000000000000001fffffffffc00000000000007ffffffe01c00000000000000000003bf81e0000000000000000000000000000000000000fffffffffe00000000000007ffffffe03c00000000000000000007ff81e00000000000000000000000000000000000003ffffffffc0000000000000fffffffc1f80000000000000000000fffe1e00000000100000000000000000000000000000ffffffffc00000000000007ffffff81f80000000000000000003ffffbf000000000000000000000000000000000000007fffffffc00000000000007fffffe01f80000000000000000003ffffff000000000000000000000000000000000000007fffffffc00000000000003fffffc01f00000000000000000003ffffff800000000000000000000000000000000000007fffffff800000000000003fffff801f0000000000000000001fffffffc00000000000000000000000000000000000007fffffff000000000000003fffff801f000000000000000000ffffffffe00008000000000000000000000000000000007fffffff000000000000001fffffc03e000000000000000003fffffffff00004000000000000000000000000000000007ffffffe000000000000001fffffc03e000000000000000007fffffffff80000000000000000000000000000000000007fffffe0000000000000001fffffc01e000000000000000007fffffffffc0000000000000000000000000000000000007fffff80000000000000000fffff001c000000000000000007fffffffffe0000000000000000000000000000000000007fffff00000000000000000ffffe0000000000000000000003fffffffffe000000000000000000000000000000000000ffffff00000000000000000ffffe0000000000000000000007fffffffffe000000000000000000000000000000000000ffffff000000000000000007fffe0000000000000000000003ffffffffff000000000000000000000000000000000000ffffff000000000000000007fffc0000000000000000000003ffffffffff000000000000000000000000000000000000fffffe000000000000000003fff80000000000000000000001ffffffffff000000000000000000000000000000000000fffffc000000000000000001fff80000000000000000000001fffffffffe000000000000000000000000000000000000fffff8000000000000000001fff00000000000000000000001fffffffffe000000000000000000000000000000000000fffff0000000000000000001ffe00000000000000000000001ffc01ffffe000000000000000000000000000000000000fffff0000000000000000001ff800000000000000000000001ff000ffffc000000000000000000000000000000000001ffffe0000000000000000000e0000000000000000000000001f00009fff8000000000000000000000000000000000001fffe0000000000000000000000000000000000000000000000000000fff8000004000000000000000000000000000003fffe00000000000000000000000000000000000000000000000000007ff0000004000000000000000000000000000003fffe00000000000000000000000000000000000000000000000000007ff0000003000000000000000000000000000003fffe00000000000000000000000000000000000000000000000000003dc0000003c00000000000000000000000000003ffe000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000007ffc000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000007ffc000000000000000000000000000000000000000000000000000000200000001000000000000000000000000000007fe00000000000000000000000000000000000000000000000000000001c000001c000000000000000000000000000007ff00000000000000000000000000000000000000000000000000000001c0000038000000000000000000000000000003fc0000000000000000000000000000000000000000000000000000000080000070000000000000000000000000000007fc00000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000ff000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000ff0000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000ffc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001ff0000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000001fe0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fe01800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000f000000000000600c00000800000000000000000000000000000000000000000e0000000000000000000000000000003fc00000006001ffffc7fffffe000000000000000000000000000000000000000c00000000000000000000000000000ffffdfc003fffffffffffffffff800000000000000000000000000000000000000f00000000000000000000000001c0fffffffc01ffffffffffffffffffffc00000000000000000000000000000000001df80000000000000000000000007fffffffffc1ffffffffffffffffffffffc0000000000000000000000000000000001ffc000000000000000007efffffffffffffffc3ffffffffffffffffffffffffc0000000000000000000000000000000fefc0000000000000fffffffffffffffffffff8ffffffffffffffffffffffffffe00000000000000000000004000000000fe0000000000003ffffffffffffffffffffffffffffffffffffffffffffffffc00000000000000006700003ffffe3c7ffe000000000001fffffffffffffffffffffffffffffffffffffffffffffffff800000000000003ffffff4007fffffffff8000000000001ffffffffffffffffffffffffffffffffffffffffffffffff8000000000000dffffffffffffffffffffc000000000000ffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000ffffffffffffffffffff800000000000ffffffffffffffffffffffffffffffffffffffffffffffffffc0000000001f9ffffffffffffffffffff000000000001fffffffffffffffffffffffffffffffffffffffffffffffffffe0000000020fffffffffffffffffffff80000000f803fffffffffffffffffffffffffffffffffffffffffffffffffffff800000001c07fffffffffffffffffff80000003fc03ffffffffffffffffffffffffffffffffffffffffffffffffffff00000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const MAX_CELLS = 195;
const CELL = 6;
const TILT = (20 * Math.PI) / 180;
const STEP = (3 * Math.PI) / 180;
const FPS = 8;
const FX_PAD = 240;
const DEG = Math.PI / 180;
const HOLE_MIN = 2.5 * DEG;
const HOLE_MAX = 11 * DEG;
const RIM_SCALE = 1.6;
const CHARGE_MS = 1500;
const CLICK_SLOP = 5;
const FRICTION = 3;
const MIN_FLING = 0.4;
const MUSIC_IDLE_MS = 20000;
const QUIP_AT = 5;
const QUIP = '...that’s how you want to change the world???';
const QUIP_CHAR_MS = 45;
const NUKE_COUNT = 16;
const NUKE_GAP_MS = 110;
const FIX_STEPS = 10;
const FIX_STEP_MS = 90;
const HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
const HEART_FILL = HEART.flatMap((row, y) => [...row].flatMap((c, x) => (c === '#' ? [[x, y]] : [])));
const HEART_EDGE = (() => {
  const fill = new Set(HEART_FILL.map(([x, y]) => `${x},${y}`));
  const edge = new Set<string>();
  for (const [x, y] of HEART_FILL)
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++)
        if (!fill.has(`${x + dx},${y + dy}`)) edge.add(`${x + dx},${y + dy}`);
  return [...edge].map((k) => k.split(',').map(Number));
})();


const land = new Uint8Array(MAP_W * MAP_H);
for (let i = 0; i < MAP.length; i++) {
  const n = parseInt(MAP[i], 16);
  for (let b = 0; b < 4; b++) land[i * 4 + b] = (n >> (3 - b)) & 1;
}

const scar = new Uint8Array(MAP_W * MAP_H);

function crater(lat: number, lon: number, power: number) {
  const HOLE = HOLE_MIN + (HOLE_MAX - HOLE_MIN) * power;
  const RIM = HOLE * RIM_SCALE;
  const span = Math.ceil((RIM / Math.PI) * MAP_H) + 1;
  const cy = Math.floor((0.5 - lat / Math.PI) * MAP_H);
  const lonSpan = Math.min(MAP_W / 2, Math.ceil(span / Math.max(0.15, Math.cos(lat))));
  const cx = Math.floor((((lon / (2 * Math.PI) + 0.5) % 1) + 1) % 1 * MAP_W);
  for (let y = Math.max(0, cy - span); y <= Math.min(MAP_H - 1, cy + span); y++) {
    const la = (0.5 - (y + 0.5) / MAP_H) * Math.PI;
    for (let dx = -lonSpan; dx <= lonSpan; dx++) {
      const x = (((cx + dx) % MAP_W) + MAP_W) % MAP_W;
      const lo = ((x + 0.5) / MAP_W - 0.5) * 2 * Math.PI;
      const c = Math.sin(lat) * Math.sin(la) + Math.cos(lat) * Math.cos(la) * Math.cos(lo - lon);
      const dist = Math.acos(Math.min(1, Math.max(-1, c)));
      const k = y * MAP_W + x;
      if (dist <= HOLE) scar[k] = 1;
      else if (dist <= RIM && scar[k] !== 1) scar[k] = 2;
    }
  }
}

function rgb(color: string): [number, number, number] {
  const m = color.match(/\d+/g) ?? ['0', '0', '255'];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

type Particle = { x: number; y: number; vx: number; vy: number; life: number; gravity: number };
type Heart = { x: number; y: number; vy: number; life: number; s: number };
type Mode = 'war' | 'nuked' | 'love';
type Missile = { lat: number; lon: number; pw: number; sx: number; sy: number; tx: number; ty: number; t: number; dur: number; x: number; y: number; dx: number; dy: number };

export function initGlobe(canvas: HTMLCanvasElement, fx: HTMLCanvasElement, quip: HTMLElement) {
  let craters = 0;
  let idleTimer = 0;

  const calmDown = () => {
    clearTimeout(idleTimer);
    if (getTrack() === 'globeMusic') setTrack('music');
  };

  let mode: Mode = 'war';

  const showQuip = () => {
    quip.textContent = '';
    const text = document.createElement('div');
    const choices = document.createElement('div');
    choices.className = 'globe-quip-choices';
    choices.innerHTML = '<button type="button" class="cta-btn cta-primary" data-choice="yes">Yes</button><button type="button" class="cta-btn" data-choice="no">No</button>';
    quip.append(text, choices);
    const spans = Array.from(QUIP, (ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.visibility = 'hidden';
      text.appendChild(s);
      return s;
    });
    quip.classList.add('is-open');
    spans.forEach((s, i) => {
      setTimeout(() => {
        s.style.visibility = '';
        pixelateIn(s, s.textContent!, s.getBoundingClientRect());
        if (s.textContent !== ' ') sfx.talk();
      }, i * QUIP_CHAR_MS);
    });
    setTimeout(() => choices.classList.add('is-ready'), spans.length * QUIP_CHAR_MS);
    choices.addEventListener('click', (e) => {
      const choice = (e.target as HTMLElement).closest<HTMLElement>('[data-choice]')?.dataset.choice;
      if (!choice) return;
      quip.classList.remove('is-open');
      if (choice === 'yes') nuke();
      else fix();
    });
  };

  const cos = Math.cos(TILT);
  const sin = Math.sin(TILT);
  const ctx = canvas.getContext('2d')!;
  const fctx = fx.getContext('2d')!;
  const small = document.createElement('canvas');
  const sctx = small.getContext('2d')!;
  const host = canvas.closest<HTMLElement>('.globe')!;

  let CELLS = 0;
  let size = 0;
  let r = 0;
  let fxSize = 0;
  let image = sctx.createImageData(1, 1);

  const layout = () => {
    const fit = Math.floor(Math.min(MAX_CELLS * CELL, host.clientWidth) / CELL);
    const cells = fit % 2 ? fit : fit - 1;
    if (cells === CELLS) return false;
    const dpr = window.devicePixelRatio || 1;
    CELLS = cells;
    size = CELLS * CELL;
    r = CELLS / 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    fxSize = size + FX_PAD * 2;
    fx.width = fxSize * dpr;
    fx.height = fxSize * dpr;
    fx.style.width = `${fxSize}px`;
    fx.style.height = `${fxSize}px`;
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    small.width = small.height = CELLS;
    image = sctx.createImageData(CELLS, CELLS);
    return true;
  };
  layout();

  let rot = 0;
  let vel = 0;

  const project = (i: number, j: number) => {
    const x = (i + 0.5 - r) / r;
    const y = (r - j - 0.5) / r;
    const d = x * x + y * y;
    if (d > 1) return null;
    const z = Math.sqrt(1 - d);
    const gy = y * cos + z * sin;
    const gz = z * cos - y * sin;
    return { lat: Math.asin(gy), lon: Math.atan2(x, gz) + rot };
  };

  const draw = () => {
    const [ar, ag, ab] = rgb(getComputedStyle(canvas).color);
    const data = image.data;
    for (let j = 0; j < CELLS; j++) {
      for (let i = 0; i < CELLS; i++) {
        const o = (j * CELLS + i) * 4;
        const p = project(i, j);
        if (!p) { data[o + 3] = 0; continue; }
        const mx = Math.floor((((p.lon / (2 * Math.PI) + 0.5) % 1) + 1) % 1 * MAP_W);
        const my = Math.min(MAP_H - 1, Math.floor((0.5 - p.lat / Math.PI) * MAP_H));
        const k = my * MAP_W + mx;
        const white = scar[k] === 1 ? false : scar[k] === 2 ? true : land[k] === 1;
        data[o] = white ? 255 : ar;
        data[o + 1] = white ? 255 : ag;
        data[o + 2] = white ? 255 : ab;
        data[o + 3] = 255;
      }
    }
    sctx.putImageData(image, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  };

  let particles: Particle[] = [];
  let hearts: Heart[] = [];
  let missiles: Missile[] = [];
  let rings: { cx: number; cy: number; step: number; steps: number; grow: number }[] = [];
  let charge: { x: number; y: number; start: number } | null = null;
  const power = () => (charge ? Math.min(1, (performance.now() - charge.start) / CHARGE_MS) : 0);

  const snap = (v: number) => Math.round(v / CELL) * CELL;
  const insideGlobe = (x: number, y: number) => {
    const dx = x - FX_PAD - size / 2;
    const dy = y - FX_PAD - size / 2;
    return dx * dx + dy * dy < (size / 2) * (size / 2);
  };

  const drawFx = () => {
    fctx.clearRect(0, 0, fxSize, fxSize);
    const accent = getComputedStyle(canvas).color;
    const dot = (x: number, y: number, s: number) => {
      fctx.fillStyle = insideGlobe(x, y) ? '#fff' : accent;
      fctx.fillRect(snap(x), snap(y), s, s);
    };
    for (const ring of rings) {
      if (ring.step < 0) continue;
      const rad = (ring.step + 1) * CELL * ring.grow;
      const n = Math.ceil((2 * Math.PI * rad) / (CELL * 2));
      for (let a = 0; a < n; a++) {
        const t = (a / n) * Math.PI * 2;
        dot(ring.cx + Math.cos(t) * rad, ring.cy + Math.sin(t) * rad, CELL);
      }
    }
    for (const p of particles) dot(p.x, p.y, p.life > 0.5 ? CELL * 2 : CELL);
    for (const h of hearts) {
      for (const [x, y] of HEART_EDGE) {
        const px = h.x + x * h.s;
        const py = h.y + y * h.s;
        fctx.fillStyle = insideGlobe(px, py) ? accent : '#fff';
        fctx.fillRect(snap(px), snap(py), h.s, h.s);
      }
      for (const [x, y] of HEART_FILL) dot(h.x + x * h.s, h.y + y * h.s, h.s);
    }
    drawMissiles(dot);
    if (charge) {
      const pw = power();
      const rad = CELL * (2 + Math.floor(pw * 12));
      const blink = pw >= 1 && Math.floor(performance.now() / 100) % 2 === 0;
      if (!blink) {
        const n = Math.max(8, Math.ceil((2 * Math.PI * rad) / (CELL * 2)));
        for (let a = 0; a < n; a++) {
          const t = (a / n) * Math.PI * 2;
          dot(charge.x + FX_PAD + Math.cos(t) * rad, charge.y + FX_PAD + Math.sin(t) * rad, CELL);
        }
      }
    }
  };

  let fxRunning = false;
  let fxLast = 0;
  const fxLoop = (now: number) => {
    if (now - fxLast >= 50) {
      const dt = fxLast ? (now - fxLast) / 1000 : 0.05;
      fxLast = now;
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 900 * p.gravity * dt;
        p.life -= dt * 1.6;
      }
      particles = particles.filter((p) => p.life > 0);
      for (const h of hearts) {
        h.y += h.vy * dt;
        if (Math.random() < 0.3) h.x += (Math.random() < 0.5 ? -1 : 1) * CELL;
        h.life -= dt * 0.7;
      }
      hearts = hearts.filter((h) => h.life > 0);
      moveMissiles(dt);
      rings.forEach((ring) => ring.step++);
      rings = rings.filter((ring) => ring.step < ring.steps);
      drawFx();
    }
    if (particles.length || rings.length || charge || missiles.length || hearts.length) requestAnimationFrame(fxLoop);
    else { fxRunning = false; fctx.clearRect(0, 0, fxSize, fxSize); }
  };

  const startFx = () => {
    if (!fxRunning) { fxRunning = true; fxLast = 0; requestAnimationFrame(fxLoop); }
  };

  const explode = (px: number, py: number, pw: number) => {
    const cx = px + FX_PAD;
    const cy = py + FX_PAD;
    rings.push({ cx, cy, step: 0, steps: 4 + Math.round(pw * 6), grow: 3 + pw * 4 });
    if (pw > 0.6) rings.push({ cx, cy, step: -2, steps: 6 + Math.round(pw * 4), grow: 2 + pw * 3 });
    const count = 24 + Math.round(pw * 120);
    for (let n = 0; n < count; n++) {
      const a = Math.random() * Math.PI * 2;
      const v = (200 + Math.random() * 500) * (1 + pw * 1.2);
      particles.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 250, life: 0.6 + Math.random() * (0.4 + pw * 0.8), gravity: 1 });
    }
    const stage = canvas.parentElement!;
    stage.classList.remove('is-shaking', 'is-shaking-big');
    void stage.offsetWidth;
    stage.classList.add(pw > 0.5 ? 'is-shaking-big' : 'is-shaking');
    startFx();
  };

  const spawnHearts = (px: number, py: number, pw: number) => {
    const count = 3 + Math.round(pw * 9);
    for (let n = 0; n < count; n++) {
      const s = CELL * (pw > 0.6 && Math.random() < 0.5 ? 2 : 1);
      hearts.push({
        x: px + FX_PAD - 3.5 * s + (Math.random() - 0.5) * (60 + pw * 200),
        y: py + FX_PAD - 3 * s + (Math.random() - 0.5) * 40,
        vy: -(120 + Math.random() * 220),
        life: 0.8 + Math.random() * 0.6,
        s,
      });
    }
    sfx.heart();
    startFx();
  };

  const hit = (e: PointerEvent, pw: number) => {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (mode === 'love') return spawnHearts(px, py, pw);
    launch(px, py, pw);
  };

  const launch = (px: number, py: number, pw: number) => {
    const p = project((px / size) * CELLS - 0.5, (py / size) * CELLS - 0.5);
    if (!p) return;
    const fromLeft = Math.random() < 0.5;
    const sx = fromLeft ? Math.random() * fxSize * 0.3 : fxSize * (0.7 + Math.random() * 0.3);
    missiles.push({
      lat: p.lat, lon: p.lon, pw, sx, sy: 0,
      tx: px + FX_PAD, ty: py + FX_PAD,
      t: 0, dur: 0.55 + pw * 0.35,
      x: sx, y: 0, dx: 0, dy: 1,
    });
    startFx();
    if (getTrack() === 'music') setTrack('globeMusic');
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(calmDown, MUSIC_IDLE_MS);
  };

  const screenOf = (lat: number, lon: number) => {
    const l = lon - rot;
    const gx = Math.cos(lat) * Math.sin(l);
    const gy = Math.sin(lat);
    const gz = Math.cos(lat) * Math.cos(l);
    const y = gy * cos - gz * sin;
    const z = gy * sin + gz * cos;
    if (z <= 0) return null;
    return { x: ((gx + 1) * size) / 2 + FX_PAD, y: ((1 - y) * size) / 2 + FX_PAD };
  };

  const impact = (m: Missile) => {
    crater(m.lat, m.lon, m.pw);
    sfx.boom(m.pw);
    explode(m.tx - FX_PAD, m.ty - FX_PAD, m.pw);
    draw();
    craters++;
    if (craters === QUIP_AT) setTimeout(showQuip, 600);
  };

  const randomVisible = () => {
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random()) * size * 0.42;
    return [size / 2 + Math.cos(a) * d, size / 2 + Math.sin(a) * d];
  };

  const nuke = () => {
    mode = 'nuked';
    document.dispatchEvent(new CustomEvent('globe:choice', { detail: 'yes' }));
    clearTimeout(idleTimer);
    setMainTrack('globeMusic');
    for (let n = 0; n < NUKE_COUNT; n++) {
      setTimeout(() => { const [x, y] = randomVisible(); launch(x, y, 1); }, n * NUKE_GAP_MS);
    }
    setTimeout(() => {
      for (let k = 0; k < scar.length; k++) if (land[k]) scar[k] = 1;
      explode(size / 2, size / 2, 1);
      sfx.boom(1);
      draw();
    }, NUKE_COUNT * NUKE_GAP_MS + 1400);
  };

  const fix = () => {
    mode = 'love';
    document.dispatchEvent(new CustomEvent('globe:choice', { detail: 'no' }));
    calmDown();
    sfx.birds();
    for (let step = 1; step <= FIX_STEPS; step++) {
      setTimeout(() => {
        scar.fill(0, 0, Math.ceil((step / FIX_STEPS) * MAP_H) * MAP_W);
        draw();
        const [x, y] = randomVisible();
        spawnHearts(x, y, 0.5);
      }, step * FIX_STEP_MS);
    }
  };

  const moveMissiles = (dt: number) => {
    for (const m of missiles) {
      m.t += dt;
      const target = screenOf(m.lat, m.lon);
      if (target) { m.tx = target.x; m.ty = target.y; }
      const k = Math.min(1, m.t / m.dur);
      const e = k * k;
      const cx = (m.sx + m.tx) / 2;
      const cy = Math.min(m.sy, m.ty) - 200;
      const u = 1 - e;
      const nx = u * u * m.sx + 2 * u * e * cx + e * e * m.tx;
      const ny = u * u * m.sy + 2 * u * e * cy + e * e * m.ty;
      const len = Math.hypot(nx - m.x, ny - m.y);
      if (len > 0.5) { m.dx = (nx - m.x) / len; m.dy = (ny - m.y) / len; }
      m.x = nx;
      m.y = ny;
      particles.push({ x: m.x, y: m.y, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40, life: 0.35, gravity: 0 });
    }
    const landed = missiles.filter((m) => m.t >= m.dur);
    missiles = missiles.filter((m) => m.t < m.dur);
    landed.forEach(impact);
  };

  const drawMissiles = (dot: (x: number, y: number, s: number) => void) => {
    for (const m of missiles) {
      const body = 3 + Math.round(m.pw * 3);
      const head = m.pw > 0.5 ? CELL * 3 : CELL * 2;
      for (let k = body; k >= 1; k--) dot(m.x - m.dx * k * CELL, m.y - m.dy * k * CELL, CELL * 2);
      dot(m.x - head / 2, m.y - head / 2, head);
    }
  };

  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastT = 0;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = 0;
    vel = 0;
    lastX = e.clientX;
    lastT = performance.now();
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    charge = { x: e.clientX - rect.left, y: e.clientY - rect.top, start: lastT };
    startFx();
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const now = performance.now();
    moved += Math.abs(dx);
    lastX = e.clientX;
    if (moved >= CLICK_SLOP) charge = null;
    const d = -dx / (size / 2);
    rot += d;
    vel = d / Math.max(0.008, (now - lastT) / 1000);
    lastT = now;
    draw();
  });

  const release = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    const pw = power();
    charge = null;
    if (moved < CLICK_SLOP) { vel = 0; hit(e, pw); }
    else if (performance.now() - lastT > 80) vel = 0;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', () => { dragging = false; vel = 0; charge = null; });

  let visible = false;
  let last = 0;
  let prev = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loop = (now: number) => {
    if (!visible) return;
    const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0;
    prev = now;
    if (!dragging) {
      if (Math.abs(vel) > MIN_FLING) {
        rot += vel * dt;
        vel *= Math.exp(-FRICTION * dt);
        draw();
      } else if (!reduced && now - last >= 1000 / FPS) {
        vel = 0;
        last = now;
        rot -= STEP;
        draw();
      }
    }
    requestAnimationFrame(loop);
  };

  draw();

  new IntersectionObserver(([entry]) => {
    const was = visible;
    visible = entry.isIntersecting;
    if (!visible) calmDown();
    if (visible && !was) { prev = 0; requestAnimationFrame(loop); }
  }).observe(canvas);

  new ResizeObserver(() => { if (layout()) draw(); }).observe(host);

  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent'] });
}
