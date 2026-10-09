import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED, splitChars, initReveals, initMagnetic, initNav, initMenu, initNewsletter } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

export function initContact(container: HTMLElement) {
  initNav();
  initMenu();
  initNewsletter(container);
  initMagnetic(container);

  const h1 = container.querySelector('.page-hero h1.split-target') as HTMLElement | null;
  if (h1 && !REDUCED) {
    const chars = splitChars(h1);
    gsap.set(chars, { yPercent: 110 });
    gsap.to(chars, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.03, delay: 0.15 });
  }

  // Floating labels: keep label up when select has value
  container.querySelectorAll<HTMLSelectElement>('.field select').forEach((sel) => {
    const sync = () => sel.closest('.field')?.classList.toggle('filled', !!sel.value);
    sel.addEventListener('change', sync);
    sync();
  });

  // Form → animated success
  const form = container.querySelector<HTMLFormElement>('#contact-form');
  const ok = container.querySelector<HTMLElement>('#form-ok');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (container.querySelector<HTMLInputElement>('#cf-name')?.value || '').trim();
    const email = (container.querySelector<HTMLInputElement>('#cf-email')?.value || '').trim();
    const msg = (container.querySelector<HTMLTextAreaElement>('#cf-msg')?.value || '').trim();
    let valid = true;
    if (name.length < 2) { markInvalid('#cf-name'); valid = false; }
    if (!email.includes('@')) { markInvalid('#cf-email'); valid = false; }
    if (msg.length < 10) { markInvalid('#cf-msg'); valid = false; }
    if (!valid) {
      if (!REDUCED) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
      return;
    }
    const done = () => {
      form.style.display = 'none';
      if (ok) {
        ok.style.display = 'block';
        const first = name.split(' ')[0];
        const h3 = ok.querySelector('h3');
        if (h3) h3.textContent = `Thank you, ${first}.`;
        if (!REDUCED) {
          gsap.from(ok, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' });
          const check = ok.querySelector('.ok-check') as SVGPathElement | null;
          if (check) {
            const len = check.getTotalLength();
            gsap.set(check, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(check, { strokeDashoffset: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
          }
        }
      }
    };
    if (REDUCED) done();
    else gsap.to(form, { opacity: 0, y: -14, duration: 0.45, ease: 'power2.in', onComplete: done });
  });

  function markInvalid(sel: string) {
    const f = container.querySelector(sel)?.closest('.field') as HTMLElement | null;
    if (!f) return;
    f.style.setProperty('--bad', '1');
    const input = f.querySelector('input, textarea') as HTMLElement | null;
    if (input) input.style.borderColor = '#b3402e';
    input?.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
  }

  initReveals(container);
}
