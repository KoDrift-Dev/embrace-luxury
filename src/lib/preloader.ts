import gsap from 'gsap';
import { REDUCED } from './motion';

let done = false;
export function wasPreloaded() { return done; }

/** Full-screen emerald preloader with counter. Runs once per full page load. */
export function runPreloader(onDone: () => void) {
  const pre = document.querySelector('.preloader') as HTMLElement | null;
  if (!pre || done) { finish(); return; }
  done = true;

  function finish() {
    pre?.remove();
    document.body.classList.remove('locked');
    onDone();
    window.dispatchEvent(new Event('el:ready'));
  }

  if (REDUCED) { finish(); return; }
  document.body.classList.add('locked');

  const count = pre.querySelector('.pl-count')!;
  const bar = pre.querySelector('.pl-bar i') as HTMLElement;
  const num = { v: 0 };
  const tl = gsap.timeline({ onComplete: finish });
  tl.to(num, {
    v: 100, duration: 1.7, ease: 'power2.inOut',
    onUpdate: () => {
      count.textContent = String(Math.round(num.v)).padStart(3, '0');
      bar.style.transform = `scaleX(${num.v / 100})`;
    },
  })
    .to('.preloader .pl-logo, .preloader .pl-sub, .preloader .pl-count, .preloader .pl-bar',
      { opacity: 0, y: -18, duration: 0.5, ease: 'power2.in', stagger: 0.06 })
    .to(pre, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.15');
}
