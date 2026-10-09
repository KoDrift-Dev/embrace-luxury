import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED } from './motion';
import { killScrollFX, scrollTop } from './motion';
import { closeDrawer, updateBadge } from './store';

gsap.registerPlugin(ScrollTrigger);

let curtain: HTMLElement | null = null;
let booted = false;

function ensureCurtain() {
  if (curtain) return curtain;
  curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.innerHTML = `
    <div class="ct-logo script">Embrace Luxury</div>
    <div class="ct-rule"></div>`;
  document.body.appendChild(curtain);
  return curtain;
}

/* Full-screen emerald wipe with gold rule + script logo. */
function curtainIn(): Promise<void> {
  const c = ensureCurtain();
  if (REDUCED) {
    gsap.set(c, { clipPath: 'inset(0 0 0% 0)' });
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => resolve() });
    tl.set(c, { clipPath: 'inset(0 0 100% 0)' })
      .to(c, { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power4.inOut' })
      .to('.ct-logo', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
      .to('.ct-rule', { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, '-=0.35');
  });
}

function curtainOut(): Promise<void> {
  const c = ensureCurtain();
  if (REDUCED) {
    gsap.set(c, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(['.ct-logo', '.ct-rule'], { opacity: 0 });
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => resolve() });
    tl.to(['.ct-logo', '.ct-rule'], { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' })
      .to(c, { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
      .set(c, { clipPath: 'inset(0 0 100% 0)' });
  });
}

export type PageInit = (container: HTMLElement) => void;
const registry = new Map<string, PageInit>();

export function registerPage(ns: string, init: PageInit) {
  registry.set(ns, init);
}

function runPage(ns: string, container: HTMLElement) {
  killScrollFX();
  updateBadge();
  registry.get(ns)?.(container);
}

export function initTransitions() {
  if (booted) return;
  booted = true;
  ensureCurtain();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  barba.init({
    transitions: [
      {
        name: 'emerald-curtain',
        async leave() {
          closeDrawer();
          document.querySelector('.mobile-menu')?.classList.remove('open');
          document.body.classList.remove('locked');
          await curtainIn();
        },
        async enter(data: any) {
          scrollTop();
          const ns = (data.next.container as HTMLElement).dataset.barbaNamespace || 'home';
          runPage(ns, data.next.container as HTMLElement);
        },
        async afterEnter() {
          await curtainOut();
          // Let layout settle, then recalc all trigger positions
          requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      },
    ],
  });

  // First page load (no transition): init directly.
  const first = document.querySelector<HTMLElement>('[data-barba="container"]');
  if (first) {
    const ns = first.dataset.barbaNamespace || 'home';
    runPage(ns, first);
  }
}
