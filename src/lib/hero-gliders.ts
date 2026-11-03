const CELL = 16;
const PAD = 8;
const FPS = 20;
const FLOCK = [5, 8];
const SPAWN_GAP = 180;

const GLIDER = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];

export function initHeroGliders(hero: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let cols = 0, rows = 0, w = 0, h = 0;
  let grid = new Uint8Array(0);
  let running = false;
  let last = 0;

  const resize = () => {
    w = hero.clientWidth;
    h = hero.clientHeight;
    const vc = Math.ceil(w / CELL), vr = Math.ceil(h / CELL);
    canvas.width = vc;
    canvas.height = vr;
    canvas.style.width = `${vc * CELL}px`;
    canvas.style.height = `${vr * CELL}px`;
    cols = vc + PAD * 2;
    rows = vr + PAD * 2;
    grid = new Uint8Array(cols * rows);
  };

  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= cols || y >= rows ? 0 : grid[y * cols + x];

  const step = () => {
    const next = new Uint8Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            if (dx || dy) n += at(x + dx, y + dy);
        const alive = grid[y * cols + x];
        next[y * cols + x] = n === 3 || (alive && n === 2) ? 1 : 0;
      }
    }
    grid = next;
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    let visible = 0;
    for (let y = PAD; y < rows - PAD; y++) {
      for (let x = PAD; x < cols - PAD; x++) {
        if (!grid[y * cols + x]) continue;
        visible++;
        ctx.fillRect(x - PAD, y - PAD, 1, 1);
      }
    }
    return visible;
  };

  const clear = (x: number, y: number) => {
    for (let dy = -2; dy < 5; dy++)
      for (let dx = -2; dx < 5; dx++)
        if (at(x + dx, y + dy)) return false;
    return true;
  };

  const spawnOne = () => {
    const viewCols = cols - PAD * 2;
    const viewRows = rows - PAD * 2;
    for (let tries = 0; tries < 50; tries++) {
      const x = PAD + Math.floor(viewCols * (0.25 + Math.random() * 0.55));
      const y = PAD + Math.floor(Math.random() * (viewRows * 0.25));
      if (!clear(x, y)) continue;
      for (const [gx, gy] of GLIDER) grid[(y + gy) * cols + x + gx] = 1;
      return;
    }
  };

  const loop = (now: number) => {
    if (now - last >= 1000 / FPS) {
      last = now;
      step();
      if (!draw()) {
        grid.fill(0);
        running = false;
        return;
      }
    }
    requestAnimationFrame(loop);
  };

  const release = () => {
    spawnOne();
    draw();
    if (!running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(loop);
    }
  };

  hero.addEventListener('click', () => {
    const count = FLOCK[0] + Math.floor(Math.random() * (FLOCK[1] - FLOCK[0] + 1));
    for (let i = 0; i < count; i++) setTimeout(release, i * SPAWN_GAP);
  });

  new ResizeObserver(() => { if (!running) resize(); }).observe(hero);
  resize();
}
