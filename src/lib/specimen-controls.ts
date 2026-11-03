import { sfx } from './sound';

type Prop = 'size' | 'tracking';

const LIMITS: Record<Prop, { min: number; max: number; step: number }> = {
  size: { min: 12, max: 256, step: 4 },
  tracking: { min: -10, max: 20, step: 1 },
};

const LINE_HEIGHT = 1.2;

function format(prop: Prop, v: number) {
  return prop === 'size' ? `${v}pt` : `${v}% Tracking`;
}

function apply(text: HTMLElement, prop: Prop, v: number) {
  if (prop === 'size') {
    text.style.fontSize = `${v}px`;
    text.style.lineHeight = `${Math.round(v * LINE_HEIGHT)}px`;
  } else {
    text.style.letterSpacing = `${v / 100}em`;
  }
}

export function initSpecimenControls() {
  document.querySelectorAll<HTMLElement>('.specimen').forEach((specimen) => {
    const text = specimen.querySelector<HTMLElement>('.specimen-text')!;

    specimen.querySelectorAll<HTMLElement>('.stepper').forEach((stepper) => {
      const prop = stepper.dataset.prop as Prop;
      const { min, max, step } = LIMITS[prop];
      const label = stepper.querySelector<HTMLElement>('.stepper-val')!;
      const [dec, inc] = stepper.querySelectorAll<HTMLButtonElement>('button');
      let value = Number(stepper.dataset.value);

      const set = (next: number, initial = false) => {
        value = Math.min(max, Math.max(min, next));
        label.textContent = format(prop, value);
        dec.disabled = value <= min;
        inc.disabled = value >= max;
        if (!initial) apply(text, prop, value);
      };

      dec.addEventListener('click', () => { set(value - step); sfx.click(); });
      inc.addEventListener('click', () => { set(value + step); sfx.click(); });
      set(value, true);
    });
  });
}
