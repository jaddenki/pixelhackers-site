export function initCursorPress() {
  const root = document.documentElement;
  const release = () => root.classList.remove('is-pressing');

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    if ((e.target as HTMLElement).closest('[contenteditable]')) return;
    root.classList.add('is-pressing');
  });
  document.addEventListener('pointerup', release);
  window.addEventListener('blur', release);
}
