import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';
import { CONFIG, type RevealConfig } from './config';

export const EASINGS: Record<string, (t: number) => number> = {
  easeOutQuad:     (t) => 1 - (1 - t) ** 2,
  easeOutCubic:    (t) => 1 - (1 - t) ** 3,
  easeOutQuart:    (t) => 1 - (1 - t) ** 4,
  easeOutQuint:    (t) => 1 - (1 - t) ** 5,
  easeInOutCubic:  (t) => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
};

// Maps config keys to their corresponding shader uniform names
const UNIFORM_MAP: Partial<Record<keyof RevealConfig, string>> = {
  maxBlockSize:  'uMaxBlockSize',
  minBlockSize:  'uMinBlockSize',
  sweepSpeed:    'uSweepSpeed',
  sweepSpread:   'uSweepSpread',
  sweepOffset:   'uSweepOffset',
  jitterAmount:  'uJitterAmount',
  jitterBase:    'uJitterBase',
  jitterFPS:     'uJitterFPS',
};

export interface RevealAPI {
  play(): void;
  updateConfig(key: keyof RevealConfig, value: number | string): void;
}

// Draws "Pixel / Hackers" in black on white — used as the shader's source texture
function renderText(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.canvas.width  = w;
  ctx.canvas.height = h;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle      = '#000000';
  ctx.font           = '500 256px "PixelHackers"';
  ctx.textAlign      = 'left';
  ctx.textBaseline   = 'top';
  ctx.fillText('Pixel',   18, 326);
  ctx.fillText('Hackers', 18, 326 + 253);
}

export async function initTextReveal(
  heroEl:   HTMLElement,
  revealEl: HTMLElement,
): Promise<RevealAPI> {
  await document.fonts.load('500 48px "PixelHackers"');

  const w = heroEl.offsetWidth;
  const h = heroEl.offsetHeight;

  // Source canvas: black text on white, consumed as a WebGL texture
  const sourceCanvas = document.createElement('canvas');
  const sourceCtx    = sourceCanvas.getContext('2d')!;
  renderText(sourceCtx, w, h);

  // Three.js renderer (transparent so the gradient shows through)
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  revealEl.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
  camera.position.z = 1;

  const texture = new THREE.CanvasTexture(sourceCanvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  const uniforms = {
    uTexture:      { value: texture },
    uProgress:     { value: 0.0 },
    uTime:         { value: 0.0 },
    uResolution:   { value: new THREE.Vector2(w, h) },
    uMaxBlockSize: { value: CONFIG.maxBlockSize },
    uMinBlockSize: { value: CONFIG.minBlockSize },
    uSweepSpeed:   { value: CONFIG.sweepSpeed },
    uSweepSpread:  { value: CONFIG.sweepSpread },
    uSweepOffset:  { value: CONFIG.sweepOffset },
    uJitterAmount: { value: CONFIG.jitterAmount },
    uJitterBase:   { value: CONFIG.jitterBase },
    uJitterFPS:    { value: CONFIG.jitterFPS },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader, fragmentShader, uniforms, transparent: true,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material));

  // Mutable animation state
  let ease:      (t: number) => number = EASINGS[CONFIG.easing] ?? EASINGS.easeOutCubic;
  let duration:  number                = CONFIG.duration;
  let animStart: number | null         = null;

  function play() {
    animStart = performance.now();
    uniforms.uProgress.value = 0.0;
  }

  function animate(now: number) {
    requestAnimationFrame(animate);
    uniforms.uTime.value = now * 0.001;

    if (animStart !== null) {
      const rawT = Math.min((now - animStart) / duration, 1.0);
      uniforms.uProgress.value = ease(rawT);
      if (rawT >= 1.0) animStart = null;
    }

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
  setTimeout(play, 500);

  window.addEventListener('resize', () => {
    const nw = heroEl.offsetWidth;
    const nh = heroEl.offsetHeight;
    renderer.setSize(nw, nh);
    uniforms.uResolution.value.set(nw, nh);
    renderText(sourceCtx, nw, nh);
    texture.needsUpdate = true;
  });

  return {
    play,

    updateConfig(key: keyof RevealConfig, value: number | string) {
      const uniformName = UNIFORM_MAP[key];
      if (uniformName && typeof value === 'number') {
        (uniforms as Record<string, { value: number }>)[uniformName].value = value;
      }
      if (key === 'easing'   && typeof value === 'string') ease     = EASINGS[value] ?? EASINGS.easeOutCubic;
      if (key === 'duration' && typeof value === 'number') duration = value;
    },
  };
}
