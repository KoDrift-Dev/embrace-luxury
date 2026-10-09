import gsap from 'gsap';

/* Custom cursor: gold dot + trailing ring. Desktop pointers only. */
export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if ((window as any).__elCursor) return;
  (window as any).__elCursor = true;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  });

  document.addEventListener('mouseover', (e) => {
    const t = (e.target as HTMLElement).closest('a, button, [data-cursor], input, textarea, select');
    ring.classList.toggle('is-hover', !!t);
  });
}
