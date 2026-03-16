import { EASINGS, type RevealAPI } from './text-reveal';
import type { RevealConfig } from './config';

// ── Panel layout ──────────────────────────────────────────────────────────────

type SliderControl = {
  type: 'slider';
  key: keyof RevealConfig;
  label: string;
  min: number; max: number; step: number;
};
type SelectControl = {
  type: 'select';
  key: keyof RevealConfig;
  label: string;
  options: string[];
};
type Control = SliderControl | SelectControl;

const PANEL: { group: string; controls: Control[] }[] = [
  { group: 'Timing', controls: [
    { key: 'duration',    label: 'Duration (ms)', type: 'slider', min: 500,  max: 6000, step: 100  },
    { key: 'easing',      label: 'Easing',        type: 'select', options: Object.keys(EASINGS)    },
  ]},
  { group: 'Sweep', controls: [
    { key: 'sweepSpeed',  label: 'Speed',          type: 'slider', min: 0.5, max: 5.0,  step: 0.1  },
    { key: 'sweepSpread', label: 'Spread',         type: 'slider', min: 0.2, max: 3.0,  step: 0.1  },
    { key: 'sweepOffset', label: 'Offset',         type: 'slider', min: 0.0, max: 1.0,  step: 0.05 },
  ]},
  { group: 'Pixelation', controls: [
    { key: 'maxBlockSize', label: 'Block Size',    type: 'slider', min: 2,   max: 40,   step: 1    },
    { key: 'minBlockSize', label: 'Min Px',        type: 'slider', min: 1,   max: 20,   step: 1    },
  ]},
  { group: 'Jitter', controls: [
    { key: 'jitterAmount', label: 'Reveal',        type: 'slider', min: 0,   max: 0.03, step: 0.001  },
    { key: 'jitterBase',   label: 'Persistent',    type: 'slider', min: 0,   max: 0.01, step: 0.0005 },
    { key: 'jitterFPS',    label: 'FPS',           type: 'slider', min: 1,   max: 60,   step: 1      },
  ]},
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatVal(v: number, step: number): string {
  if (step >= 1) return String(Math.round(v));
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  return v.toFixed(decimals);
}

// ── Styles ────────────────────────────────────────────────────────────────────

const PANEL_CSS = `
  #dial-panel {
    position: fixed; top: 12px; right: 12px; z-index: 9999;
    width: 260px; max-height: calc(100vh - 24px); overflow-y: auto;
    background: rgba(10, 10, 10, 0.94); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 11px; color: #999;
    padding: 10px 0 8px; display: none;
    user-select: none; -webkit-user-select: none;
  }
  #dial-panel.open { display: block; }
  #dial-panel::-webkit-scrollbar { width: 3px; }
  #dial-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .dp-group       { padding: 0 12px; margin-bottom: 2px; }
  .dp-group-label {
    font-size: 9px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
    padding: 8px 0 4px; border-top: 1px solid rgba(255,255,255,0.05);
  }
  .dp-group:first-child .dp-group-label { border-top: none; padding-top: 2px; }

  .dp-row   { display: flex; align-items: center; gap: 6px; height: 26px; }
  .dp-label { flex: 0 0 76px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dp-val   { flex: 0 0 40px; text-align: right; font-variant-numeric: tabular-nums; color: #ddd; font-size: 10px; }

  .dp-row input[type=range] {
    flex: 1; height: 2px; -webkit-appearance: none; appearance: none;
    background: rgba(255,255,255,0.1); border-radius: 2px; outline: none; cursor: pointer;
  }
  .dp-row input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 9px; height: 9px;
    background: #fff; border-radius: 50%; cursor: pointer;
  }
  .dp-row select {
    flex: 1; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.08);
    color: #ddd; font-size: 10px; border-radius: 4px; padding: 2px 4px;
    outline: none; cursor: pointer;
  }

  .dp-actions { padding: 10px 12px 4px; display: flex; gap: 6px; }
  .dp-btn {
    flex: 1; padding: 5px 0; text-align: center; font-size: 10px; font-weight: 600;
    border-radius: 5px; cursor: pointer; border: none; letter-spacing: 0.02em;
  }
  .dp-btn-replay { background: rgba(255,255,255,0.1); color: #fff; }
  .dp-btn-replay:hover { background: rgba(255,255,255,0.18); }
  .dp-btn-reset  { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.4); }
  .dp-btn-reset:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .dp-copy-row  { padding: 4px 12px 0; }
  .dp-btn-copy  {
    width: 100%; padding: 5px 0; font-size: 10px; font-weight: 600;
    border-radius: 5px; cursor: pointer; border: none; letter-spacing: 0.02em;
    background: rgba(0, 0, 255, 0.25); color: #aac9ff;
  }
  .dp-btn-copy:hover { background: rgba(0, 0, 255, 0.4); color: #fff; }

  .dp-hint { text-align: center; font-size: 9px; color: rgba(255,255,255,0.15); padding: 6px 0 2px; }
`;

// ── Main export ───────────────────────────────────────────────────────────────

export function createControlPanel(config: RevealConfig, api: RevealAPI) {
  const original = JSON.parse(JSON.stringify(config)) as RevealConfig;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = PANEL_CSS;
  document.head.appendChild(styleEl);

  const panel = document.createElement('div');
  panel.id = 'dial-panel';

  // Build control rows
  for (const group of PANEL) {
    const groupEl = document.createElement('div');
    groupEl.className = 'dp-group';
    groupEl.innerHTML = `<div class="dp-group-label">${group.group}</div>`;

    for (const ctrl of group.controls) {
      const row = document.createElement('div');
      row.className = 'dp-row';

      if (ctrl.type === 'slider') {
        const v = config[ctrl.key] as number;
        row.innerHTML = `
          <span class="dp-label">${ctrl.label}</span>
          <input type="range" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${v}" />
          <span class="dp-val">${formatVal(v, ctrl.step)}</span>
        `;
        const input = row.querySelector('input') as HTMLInputElement;
        const valEl = row.querySelector('.dp-val') as HTMLElement;
        input.addEventListener('input', () => {
          const num = parseFloat(input.value);
          (config as Record<string, unknown>)[ctrl.key] = num;
          valEl.textContent = formatVal(num, ctrl.step);
          api.updateConfig(ctrl.key, num);
        });

      } else if (ctrl.type === 'select') {
        const opts = ctrl.options
          .map(o => `<option value="${o}" ${o === config[ctrl.key] ? 'selected' : ''}>${o}</option>`)
          .join('');
        row.innerHTML = `<span class="dp-label">${ctrl.label}</span><select>${opts}</select>`;
        row.querySelector('select')!.addEventListener('change', (e) => {
          const val = (e.target as HTMLSelectElement).value;
          (config as Record<string, unknown>)[ctrl.key] = val;
          api.updateConfig(ctrl.key, val);
        });
      }

      groupEl.appendChild(row);
    }
    panel.appendChild(groupEl);
  }

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'dp-actions';
  actions.innerHTML = `
    <button class="dp-btn dp-btn-replay">Replay</button>
    <button class="dp-btn dp-btn-reset">Reset</button>
  `;
  actions.querySelector('.dp-btn-replay')!.addEventListener('click', (e) => {
    e.stopPropagation();
    api.play();
  });
  actions.querySelector('.dp-btn-reset')!.addEventListener('click', (e) => {
    e.stopPropagation();
    Object.assign(config, JSON.parse(JSON.stringify(original)));
    syncInputsToConfig();
    api.play();
  });
  panel.appendChild(actions);

  // Copy values button
  const copyRow = document.createElement('div');
  copyRow.className = 'dp-copy-row';
  const copyBtn = document.createElement('button');
  copyBtn.className = 'dp-btn dp-btn-copy';
  copyBtn.textContent = 'Copy Values';
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const pad = 14; // align values column
    const lines = (Object.keys(config) as (keyof RevealConfig)[]).map((key) => {
      const val   = config[key];
      const label = `${key}:`.padEnd(pad);
      const str   = typeof val === 'string' ? `'${val}'` : String(val);
      return `  ${label} ${str},`;
    });
    const output = `export const CONFIG: RevealConfig = {\n${lines.join('\n')}\n};`;
    navigator.clipboard.writeText(output).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy Values'; }, 1500);
    });
  });
  copyRow.appendChild(copyBtn);
  panel.appendChild(copyRow);

  const hint = document.createElement('div');
  hint.className = 'dp-hint';
  hint.textContent = 'D — toggle  ·  Space — replay';
  panel.appendChild(hint);

  document.body.appendChild(panel);

  // Sync all inputs to current config values (used by Reset)
  function syncInputsToConfig() {
    const rows = panel.querySelectorAll<HTMLElement>('.dp-row');
    let i = 0;
    for (const group of PANEL) {
      for (const ctrl of group.controls) {
        const row = rows[i++];
        if (ctrl.type === 'slider') {
          const v = config[ctrl.key] as number;
          (row.querySelector('input') as HTMLInputElement).value = String(v);
          (row.querySelector('.dp-val') as HTMLElement).textContent = formatVal(v, ctrl.step);
          api.updateConfig(ctrl.key, v);
        } else if (ctrl.type === 'select') {
          (row.querySelector('select') as HTMLSelectElement).value = config[ctrl.key] as string;
          api.updateConfig(ctrl.key, config[ctrl.key] as string);
        }
      }
    }
  }

  // Keyboard shortcuts (skip when focus is in a contenteditable field)
  window.addEventListener('keydown', (e) => {
    const inEditable = (e.target as Element).closest('[contenteditable]');
    if (e.ctrlKey || e.metaKey || inEditable) return;

    if (e.code === 'KeyD')  panel.classList.toggle('open');
    if (e.code === 'Space') { e.preventDefault(); api.play(); }
  });
}
