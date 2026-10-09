import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;

export function initSmooth() {
  if (REDUCED || (window as any).__elLenis) return;
  (window as any).__elLenis = true;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function stopScroll() {
  lenis?.stop();
  document.body.classList.add('locked');
}

export function startScroll() {
  lenis?.start();
  document.body.classList.remove('locked');
}

export function killScrollFX() {
  ScrollTrigger.getAll().forEach(t => t.kill());
}

/* Split an element's text into word > char spans for staggered animation.
   Idempotent: returns existing chars if already split.
   Preserves inline elements (<em>, <br>) instead of flattening them. */
export function splitChars(el: HTMLElement): HTMLElement[] {
  if (el.classList.contains('split')) {
    return Array.from(el.querySelectorAll<HTMLElement>('.char'));
  }
  const chars: HTMLElement[] = [];
  const processNode = (node: Node, parent: HTMLElement) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent || '').split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); continue; }
        const word = document.createElement('span');
        word.className = 'word';
        for (const ch of part) {
          const c = document.createElement('span');
          c.className = 'char';
          c.textContent = ch;
          word.appendChild(c);
          chars.push(c);
        }
        parent.appendChild(word);
      }
    } else if (node.nodeName === 'BR') {
      parent.appendChild(document.createElement('br'));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const src = node as HTMLElement;
      const tag = src.tagName.toLowerCase();
      const wrap = document.createElement(tag === 'em' || tag === 'strong' || tag === 'i' ? tag : 'span');
      if (src.className) wrap.className = src.className;
      const style = src.getAttribute('style');
      if (style) wrap.setAttribute('style', style);
      parent.appendChild(wrap);
      src.childNodes.forEach((n) => processNode(n, wrap));
    }
  };
  const nodes = Array.from(el.childNodes);
  el.textContent = '';
  nodes.forEach((n) => processNode(n, el));
  el.classList.add('split');
  return chars;
}

/* Batch reveal for [data-reveal] elements within a root. */
export function initReveals(root: ParentNode = document) {
  if (REDUCED) return;
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  els.forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    gsap.fromTo(el,
      { opacity: 0, y: 44 },
      {
        opacity: 1, y: 0, duration: 1.1, delay, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
  });
}

/* Stagger group: [data-reveal-group] children rise in sequence. */
export function initGroups(root: ParentNode = document) {
  if (REDUCED) return;
  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-group]'));
  groups.forEach((g) => {
    gsap.fromTo(g.children,
      { opacity: 0, y: 54 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: g, start: 'top 85%', once: true },
      });
  });
}

/* Infinite marquee: .marquee-track content duplicated in markup. */
export function initMarquee(root: ParentNode = document) {
  if (REDUCED) return;
  const tracks = Array.from(root.querySelectorAll<HTMLElement>('.marquee-track'));
  tracks.forEach((track) => {
    gsap.to(track, { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
  });
}

/* Parallax on [data-parallax] images (inner img moves within overflow hidden). */
export function initParallax(root: ParentNode = document) {
  if (REDUCED) return;
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
  els.forEach((el) => {
    const img = el.querySelector('img') || el;
    const amt = parseFloat(el.dataset.parallax || '12');
    gsap.fromTo(img, { yPercent: -amt / 2 }, {
      yPercent: amt / 2, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* Magnetic hover for [data-magnetic]. */
export function initMagnetic(root: ParentNode = document) {
  if (REDUCED || !FINE_POINTER) return;
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic]'));
  els.forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.32);
      yTo((e.clientY - r.top - r.height / 2) * 0.32);
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* Gentle idle float for .float-card elements (delayed past the hero intro). */
export function initFloat(root: ParentNode = document) {
  if (REDUCED) return;
  const els = Array.from(root.querySelectorAll<HTMLElement>('.float-card'));
  els.forEach((el, i) => {
    gsap.to(el, { y: -14, duration: 2.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
  });
}

/* Nav scrolled state (single global listener — safe across Barba swaps). */
let navBound = false;
function syncNav() {
  document.querySelector('.nav')?.classList.toggle('scrolled', window.scrollY > 40);
}
export function initNav() {
  syncNav();
  if (navBound) return;
  navBound = true;
  window.addEventListener('scroll', syncNav, { passive: true });
}

/* Mobile menu toggle. */
export function initMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  const close = () => { menu.classList.remove('open'); document.body.classList.remove('locked'); };
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    document.body.classList.toggle('locked', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* Newsletter forms (footer) — front-end success state. */
export function initNewsletter(root: ParentNode = document) {
  const forms = Array.from(root.querySelectorAll<HTMLFormElement>('.news-form'));
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (!input || !input.value.includes('@')) {
        gsap.fromTo(form, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
        input?.focus();
        return;
      }
      const ok = form.parentElement?.querySelector('.news-ok') as HTMLElement | null;
      gsap.to(form, {
        opacity: 0, y: -8, duration: 0.4, ease: 'power2.in',
        onComplete: () => {
          form.style.display = 'none';
          if (ok) {
            ok.style.display = 'flex';
            gsap.from(ok, { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' });
          }
        },
      });
    });
  });
}
