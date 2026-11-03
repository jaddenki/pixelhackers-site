import Matter from 'matter-js';
import { sfx } from './sound';

const MODULE_EM = 0.05;
const SAMPLE_EM = 20;
const SAMPLE_PAD = 10;
const SAMPLE_ASCENT = 16;
const DRAW_FPS = 20;
const RETURN_STEPS = 6;
const LAND_SPEED = 3;
const RAIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?#&@$%*+=<>{}[]()←↑→↓✸◊∞≈ÆØßÐÞ¿¡';
const RAIN_COUNT = 48;
const RAIN_GAP_MS = 60;

type Glyph = { ink: boolean[]; w: number; h: number; offX: number; offY: number };
type Letter = { body: Matter.Body; glyph: Glyph; slot: HTMLElement | null };

const sampler = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;

function glyphOf(ch: string): Glyph {
  const size = SAMPLE_EM + SAMPLE_PAD * 2;
  sampler.canvas.width = sampler.canvas.height = size;
  sampler.font = `500 ${SAMPLE_EM}px PixelHackers`;
  sampler.textBaseline = 'alphabetic';
  sampler.fillText(ch, SAMPLE_PAD, SAMPLE_PAD + SAMPLE_ASCENT);
  const data = sampler.getImageData(0, 0, size, size).data;
  let minX = size, minY = size, maxX = -1, maxY = -1;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (data[(y * size + x) * 4 + 3] > 127) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const ink: boolean[] = [];
  for (let y = minY; y <= maxY; y++)
    for (let x = minX; x <= maxX; x++) ink.push(data[(y * size + x) * 4 + 3] > 127);
  return { ink, w, h, offX: minX - SAMPLE_PAD, offY: minY - SAMPLE_PAD };
}

export function initCharsFall(root: HTMLElement) {
  const sample = root.querySelector<HTMLElement>('.chars-sample')!;
  const canvas = root.querySelector<HTMLCanvasElement>('.chars-canvas')!;
  const ctx = canvas.getContext('2d')!;

  for (const node of Array.from(sample.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const frag = document.createDocumentFragment();
    for (const ch of node.textContent ?? '') {
      const span = document.createElement('span');
      span.textContent = ch;
      frag.appendChild(span);
    }
    node.replaceWith(frag);
  }

  const engine = Matter.Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.6;
  let walls: Matter.Body[] = [];
  let letters: Letter[] = [];
  let running = false;
  let returning = false;
  let lastDraw = 0;
  let lastStep = 0;
  let cell = 4;
  let rained = false;
  let rainTimers: number[] = [];

  const fit = () => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Matter.Composite.remove(engine.world, walls);
    const t = 200;
    walls = [
      Matter.Bodies.rectangle(w / 2, h + t / 2, w * 2, t, { isStatic: true }),
      Matter.Bodies.rectangle(-t / 2, h / 2, t, h * 4, { isStatic: true }),
      Matter.Bodies.rectangle(w + t / 2, h / 2, t, h * 4, { isStatic: true }),
    ];
    Matter.Composite.add(engine.world, walls);
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(root).color;
    for (const { body, glyph } of letters) {
      const { x: cx, y: cy } = body.position;
      const a = body.angle;
      const ca = Math.cos(-a);
      const sa = Math.sin(-a);
      const reach = Math.ceil(Math.hypot(glyph.w, glyph.h) / 2) + 1;
      const gx0 = Math.round(cx / cell);
      const gy0 = Math.round(cy / cell);
      for (let gy = gy0 - reach; gy <= gy0 + reach; gy++) {
        for (let gx = gx0 - reach; gx <= gx0 + reach; gx++) {
          const dx = (gx + 0.5) * cell - cx;
          const dy = (gy + 0.5) * cell - cy;
          const u = Math.floor((dx * ca - dy * sa) / cell + glyph.w / 2);
          const v = Math.floor((dx * sa + dy * ca) / cell + glyph.h / 2);
          if (u < 0 || v < 0 || u >= glyph.w || v >= glyph.h || !glyph.ink[v * glyph.w + u]) continue;
          ctx.fillRect(gx * cell, gy * cell, cell, cell);
        }
      }
    }
  };

  const loop = (now: number) => {
    const dt = lastStep ? Math.min(32, now - lastStep) : 16;
    lastStep = now;
    Matter.Engine.update(engine, dt);
    if (now - lastDraw >= 1000 / DRAW_FPS) {
      lastDraw = now;
      draw();
    }
    if (letters.some((l) => !l.body.isSleeping)) requestAnimationFrame(loop);
    else { running = false; draw(); }
  };

  const start = () => {
    if (!running) { running = true; lastStep = 0; requestAnimationFrame(loop); }
  };

  Matter.Events.on(engine, 'collisionStart', (e) => {
    for (const pair of e.pairs) {
      const speed = Math.max(pair.bodyA.speed, pair.bodyB.speed);
      if (speed > LAND_SPEED) { sfx.click(); break; }
    }
  });

  const drop = (slot: HTMLElement) => {
    if (returning || slot.style.visibility === 'hidden') return;
    if (!walls.length) fit();
    cell = parseFloat(getComputedStyle(sample).fontSize) * MODULE_EM;
    const glyph = glyphOf(slot.textContent!);
    if (!glyph.w) return;
    const base = root.getBoundingClientRect();
    const r = slot.getBoundingClientRect();
    const lineH = r.height;
    const fontPx = cell / MODULE_EM;
    const emTop = r.top - base.top + (lineH - fontPx) / 2;
    const left = Math.round((r.left - base.left) / cell) * cell + glyph.offX * cell;
    const top = Math.round(emTop / cell) * cell + glyph.offY * cell;
    const w = glyph.w * cell;
    const h = glyph.h * cell;
    const body = Matter.Bodies.rectangle(left + w / 2, top + h / 2, w, h, { restitution: 0.15, friction: 0.6, density: 0.002 });
    Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: -6 });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);
    Matter.Composite.add(engine.world, body);
    letters.push({ body, glyph, slot });
    slot.style.visibility = 'hidden';
    start();
    const slots = sample.querySelectorAll<HTMLElement>('span');
    if (!rained && Array.from(slots).every((s) => s.style.visibility === 'hidden')) rain();
  };

  const rain = () => {
    rained = true;
    const w = root.clientWidth;
    for (let n = 0; n < RAIN_COUNT; n++) {
      rainTimers.push(window.setTimeout(() => {
        const glyph = glyphOf(RAIN[Math.floor(Math.random() * RAIN.length)]);
        if (!glyph.w) return;
        const gw = glyph.w * cell;
        const gh = glyph.h * cell;
        const x = gw + Math.random() * (w - gw * 2);
        const body = Matter.Bodies.rectangle(x, -gh, gw, gh, { restitution: 0.15, friction: 0.6, density: 0.002 });
        Matter.Body.setAngle(body, Math.random() * Math.PI * 2);
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);
        Matter.Composite.add(engine.world, body);
        letters.push({ body, glyph, slot: null });
        start();
      }, 500 + n * RAIN_GAP_MS));
    }
  };

  const kick = (letter: Letter) => {
    Matter.Sleeping.set(letter.body, false);
    Matter.Body.setVelocity(letter.body, { x: (Math.random() - 0.5) * 8, y: -14 });
    Matter.Body.setAngularVelocity(letter.body, (Math.random() - 0.5) * 0.5);
    sfx.click();
    start();
  };

  const reassemble = () => {
    if (returning || !letters.length) return;
    returning = true;
    rainTimers.forEach(clearTimeout);
    rainTimers = [];
    const h = root.clientHeight;
    const base = root.getBoundingClientRect();
    const fontPx = cell / MODULE_EM;
    const moves = letters.map((l) => {
      if (!l.slot) {
        return { l, from: { ...l.body.position, a: l.body.angle }, to: { x: l.body.position.x, y: h + l.glyph.h * cell * 2, a: l.body.angle } };
      }
      const r = l.slot.getBoundingClientRect();
      const emTop = r.top - base.top + (r.height - fontPx) / 2;
      const left = Math.round((r.left - base.left) / cell) * cell + l.glyph.offX * cell;
      const top = Math.round(emTop / cell) * cell + l.glyph.offY * cell;
      return {
        l,
        from: { ...l.body.position, a: l.body.angle },
        to: { x: left + (l.glyph.w * cell) / 2, y: top + (l.glyph.h * cell) / 2, a: Math.round(l.body.angle / (2 * Math.PI)) * 2 * Math.PI },
      };
    });
    Matter.Composite.remove(engine.world, letters.map((l) => l.body));
    for (let step = 1; step <= RETURN_STEPS; step++) {
      setTimeout(() => {
        const k = step / RETURN_STEPS;
        for (const m of moves) {
          Matter.Body.setPosition(m.l.body, { x: m.from.x + (m.to.x - m.from.x) * k, y: m.from.y + (m.to.y - m.from.y) * k });
          Matter.Body.setAngle(m.l.body, m.from.a + (m.to.a - m.from.a) * k);
        }
        draw();
        if (step === RETURN_STEPS) {
          moves.forEach((m) => m.l.slot && (m.l.slot.style.visibility = ''));
          letters = [];
          rained = false;
          draw();
          returning = false;
          sfx.click();
        }
      }, step * (1000 / DRAW_FPS));
    }
  };

  root.addEventListener('click', (e) => {
    const slot = (e.target as HTMLElement).closest<HTMLElement>('.chars-sample span');
    if (slot) return drop(slot);
    const base = root.getBoundingClientRect();
    const point = { x: e.clientX - base.left, y: e.clientY - base.top };
    const [hit] = Matter.Query.point(letters.map((l) => l.body), point);
    const letter = letters.find((l) => l.body === hit);
    if (letter) kick(letter);
    else reassemble();
  });

  new ResizeObserver(() => { if (walls.length) { fit(); draw(); } }).observe(root);
}
