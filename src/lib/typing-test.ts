import { sfx, setTrack } from './sound';
import { pixelateIn } from './type-pixelate';

const WORDS = `the be to of and a in that have it for not on with he as you do at this but his by from they we say her
she or an will my one all would there their what so up out if about who get which go me when make can like time no
just him know take people into year your good some could them see other than then now look only come its over think
also back after use two how our work first well way even new want because any these give day most us is was are
been has had were said did made find here thing many long down little world very still own should never tell feel
high last place where through great old big same right small large next early young few public bad able home hand
part life child eye woman man week case point fact group number night water room mother area money story month lot
book job word business issue side kind head house service friend father power hour game line end member law car city
name team minute idea kid body back face others level office door health person art war history party result change
morning reason research girl guy moment air teacher force order`.split(/\s+/);

const CUES: [number, string][] = [[250, 'Ready...'], [1000, 'Set...'], [1900, 'JAM!!!!']];
const GO_AT = 2600;
const MAX_EXTRA = 5;
const CHUNK = 5;
const CUE_CHAR_DELAY = 55;
const CLASSIC_BATCH = 120;
const MODE_KEY = 'ph-wpm-mode';

type State = 'idle' | 'countdown' | 'running' | 'done';
type Mode = 'big' | 'classic';

const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export function initTypingTest(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>('.wpm-box')!;
  const text = root.querySelector<HTMLElement>('.wpm-text')!;
  const nextEl = root.querySelector<HTMLElement>('.wpm-next')!;
  const spaceHint = root.querySelector<HTMLElement>('.wpm-space')!;
  const input = root.querySelector<HTMLInputElement>('.wpm-input')!;
  const timer = root.querySelector<HTMLElement>('.wpm-timer')!;
  const result = root.querySelector<HTMLElement>('.wpm-result')!;
  const durationBtns = root.querySelectorAll<HTMLButtonElement>('[data-duration]');
  const modeBtns = root.querySelectorAll<HTMLButtonElement>('[data-mode]');
  const flow = root.querySelector<HTMLElement>('.wpm-flow')!;

  let mode: Mode = 'big';
  try { if (localStorage.getItem(MODE_KEY) === 'classic') mode = 'classic'; } catch {}
  let classicWords: string[] = [];
  let classicEls: HTMLElement[] = [];
  let classicIndex = -1;
  let host: HTMLElement = text;

  let state: State = 'idle';
  let duration = 30;
  let word = '';
  let chunk: string[] = [];
  let nextChunk: string[] = [];
  let chunkIndex = 0;
  let typed = '';
  let spans: HTMLSpanElement[] = [];
  let correctChars = 0;
  let keystrokes = 0;
  let correctKeys = 0;
  let start = 0;
  let pending: number[] = [];

  const show = (value: string, className = '', pop = true, stagger = 0) => {
    text.textContent = '';
    spans = Array.from(value, (ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.className = className;
      return s;
    });
    text.append(...spans);
    if (!pop) return;
    spans.forEach((s, i) => {
      const reveal = () => {
        s.style.visibility = '';
        pixelateIn(s, s.textContent!, s.getBoundingClientRect());
      };
      if (!stagger) return reveal();
      s.style.visibility = 'hidden';
      pending.push(window.setTimeout(reveal, i * stagger));
    });
  };

  const paint = () => {
    const extra = typed.slice(word.length);
    if (spans.length !== word.length + extra.length) {
      spans.slice(word.length).forEach((s) => s.remove());
      spans = spans.slice(0, word.length);
      for (const ch of extra) {
        const s = document.createElement('span');
        s.textContent = ch;
        host.appendChild(s);
        spans.push(s);
      }
    }
    spans.forEach((s, i) => {
      const t = typed[i];
      s.className = t === undefined ? '' : i < word.length && t === word[i] ? 'ok' : 'bad';
    });
    if (typed.length < spans.length) spans[typed.length].classList.add('caret');
    else spans[spans.length - 1]?.classList.add('caret-end');
    spaceHint.classList.toggle('is-ready', typed.length >= word.length);
    if (mode === 'classic') {
      const lineH = parseFloat(getComputedStyle(flow).lineHeight);
      const line = Math.floor(host.offsetTop / lineH);
      flow.style.transform = `translateY(${-Math.max(0, line - 1) * lineH}px)`;
    }
  };

  const appendClassic = () => {
    for (let i = 0; i < CLASSIC_BATCH; i++) {
      const w = randomWord();
      const el = document.createElement('span');
      el.className = 'w';
      for (const ch of w) {
        const l = document.createElement('span');
        l.textContent = ch;
        el.appendChild(l);
      }
      if (classicEls.length) flow.append(' ');
      flow.appendChild(el);
      classicWords.push(w);
      classicEls.push(el);
    }
  };

  const resetClassic = () => {
    flow.textContent = '';
    flow.style.transform = '';
    classicWords = [];
    classicEls = [];
    classicIndex = -1;
  };

  const nextClassicWord = () => {
    spans.forEach((s) => s.classList.remove('caret', 'caret-end'));
    classicIndex++;
    if (classicIndex >= classicWords.length - 20) appendClassic();
    word = classicWords[classicIndex];
    host = classicEls[classicIndex];
    spans = Array.from(host.children) as HTMLSpanElement[];
    typed = '';
    input.value = '';
    input.maxLength = word.length + MAX_EXTRA;
    paint();
  };

  const nextWord = () => {
    if (mode === 'classic') return nextClassicWord();
    host = text;
    chunkIndex++;
    if (chunkIndex >= chunk.length) {
      chunk = nextChunk.length ? nextChunk : Array.from({ length: CHUNK }, randomWord);
      nextChunk = Array.from({ length: CHUNK }, randomWord);
      chunkIndex = 0;
      const row = (words: string[]) => `<div>${words.map((w) => `<span>${w}</span>`).join(' ')}</div>`;
      nextEl.innerHTML = row(chunk) + row(nextChunk);
    }
    word = chunk[chunkIndex];
    Array.from(nextEl.firstElementChild!.children).forEach((el, i) => {
      el.className = i < chunkIndex ? 'done' : i === chunkIndex ? 'now' : '';
    });
    typed = '';
    input.value = '';
    input.maxLength = word.length + MAX_EXTRA;
    show(word, '', false);
    paint();
  };

  const scoreWord = (final: boolean) => {
    if (final ? word.startsWith(typed) : typed === word) correctChars += typed.length + (final ? 0 : 1);
  };

  const clearPending = () => { pending.forEach(clearTimeout); pending = []; };

  const idle = () => {
    clearPending();
    state = 'idle';
    box.classList.remove('is-done', 'is-running');
    timer.textContent = `${duration}s`;
    typed = '';
    chunk = [];
    nextChunk = [];
    chunkIndex = 0;
    resetClassic();
    host = text;
    nextEl.textContent = '';
    input.value = '';
    text.textContent = '';
    spans = [];
    box.classList.add('is-idle');
    setTrack('music');
  };

  const finish = () => {
    clearPending();
    scoreWord(true);
    state = 'done';
    const wpm = Math.round(correctChars / 5 / (duration / 60));
    const acc = keystrokes ? Math.round((correctKeys / keystrokes) * 100) : 0;
    result.innerHTML = `<div class="wpm-score">${wpm} WPM</div><div>${acc}% Accuracy</div><div class="wpm-hint">Click or press Tab to go again</div>`;
    box.classList.remove('is-running');
    box.classList.add('is-done');
    sfx.cheer();
    setTrack('music');
    timer.textContent = '0s';
  };

  const tick = () => {
    if (state !== 'running') return;
    const left = Math.max(0, duration - Math.floor((performance.now() - start) / 1000));
    timer.textContent = `${left}s`;
    if (left === 0) finish();
    else pending.push(window.setTimeout(tick, 100));
  };

  const go = () => {
    state = 'running';
    start = 0;
    box.classList.add('is-running');
    nextWord();
  };

  const countdown = async () => {
    clearPending();
    state = 'countdown';
    correctChars = keystrokes = correctKeys = 0;
    box.classList.remove('is-done', 'is-running', 'is-idle');
    timer.textContent = `${duration}s`;
    typed = '';
    chunk = [];
    nextChunk = [];
    chunkIndex = 0;
    resetClassic();
    host = text;
    nextEl.textContent = '';
    input.value = '';
    input.focus();
    text.textContent = '';
    spans = [];

    setTrack('testMusic');
    await sfx.ready();
    if (state !== 'countdown') return;

    for (const [at, cue] of CUES) pending.push(window.setTimeout(() => show(cue, 'cue', true, CUE_CHAR_DELAY), at));
    pending.push(window.setTimeout(go, GO_AT));
  };

  input.addEventListener('input', (e) => {
    if (state !== 'running') { input.value = typed; return; }
    const ie = e as InputEvent;
    const value = input.value;

    if (!start && value.trim()) {
      start = performance.now();
      tick();
    }

    if (value.endsWith(' ')) {
      keystrokes++;
      if (typed === word) correctKeys++;
      sfx.key();
      if (!typed.length) { input.value = ''; return; }
      scoreWord(false);
      nextWord();
      return;
    }

    if (ie.inputType === 'insertText' && ie.data) {
      keystrokes++;
      const i = value.length - 1;
      if (value[i] === word[i]) correctKeys++;
      sfx.key();
    }

    typed = value;
    paint();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); countdown(); }
  });

  input.addEventListener('focus', () => box.classList.add('is-focused'));
  input.addEventListener('blur', () => box.classList.remove('is-focused'));

  root.querySelector<HTMLButtonElement>('.wpm-start')!.addEventListener('click', (e) => {
    e.stopPropagation();
    countdown();
  });

  box.addEventListener('click', () => {
    if (state === 'done') countdown();
    else if (state !== 'idle') input.focus();
  });

  const applyMode = () => {
    box.classList.toggle('is-classic', mode === 'classic');
    modeBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.mode === mode));
  };

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode as Mode;
      try { localStorage.setItem(MODE_KEY, mode); } catch {}
      applyMode();
      sfx.click();
      idle();
    });
  });

  applyMode();

  durationBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      duration = Number(btn.dataset.duration);
      durationBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      sfx.click();
      idle();
    });
  });

  idle();
}
