import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUCED, splitChars, initReveals, initParallax, initMagnetic, initNav, initMenu, initNewsletter } from '../lib/motion';
import { imgCraftGoldsmith, imgCraftSketch, imgCraftStones, imgBannerModel } from '../data/images';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    title: 'Bespoke Commissions',
    copy: 'Begin with a conversation. Our designers translate your story into one-of-one pieces — engagement rings, heirloom redesigns, bridal sets — sketched by hand and rendered in 3D before a single stone is cut.',
    points: ['Private design consultation', 'Hand sketches & 3D renders', 'Ethically sourced diamonds & emeralds', '4–6 week atelier timeline'],
    image: imgCraftSketch,
    alt: 'Jewellery design sketch with emeralds',
  },
  {
    num: '02',
    title: 'Restoration & Care',
    copy: 'Heirlooms deserve a second century. Our master goldsmiths restore, resize, re-polish and re-set treasured pieces, returning them to you with a full condition report.',
    points: ['Ultrasonic deep clean', 'Stone tightening & re-setting', 'Rhodium & gold re-plating', 'Complimentary annual inspection'],
    image: imgCraftGoldsmith,
    alt: 'Goldsmith restoring a bracelet',
  },
  {
    num: '03',
    title: 'Gifting Concierge',
    copy: 'For milestones that matter. Tell us the occasion and the person — we curate, wrap in our signature emerald coffret, and deliver with a handwritten note anywhere in Pakistan.',
    points: ['Curated selections by budget', 'Signature emerald gift coffret', 'Handwritten notes', 'Insured nationwide delivery'],
    image: imgBannerModel,
    alt: 'Model wearing Embrace Luxury jewellery',
  },
];

const STEPS = [
  { t: 'Consult', d: 'Share your vision over tea at the boutique or on a video call.' },
  { t: 'Design', d: 'Hand sketches refined into photoreal 3D renders for approval.' },
  { t: 'Craft', d: 'Cast, set and polished by hand in our Lahore atelier.' },
  { t: 'Deliver', d: 'Presented in the emerald coffret, insured to your door.' },
];

export function initServices(container: HTMLElement) {
  initNav();
  initMenu();
  initNewsletter(container);
  initMagnetic(container);
  initParallax(container);

  const h1 = container.querySelector('.page-hero h1.split-target') as HTMLElement | null;
  if (h1 && !REDUCED) {
    const chars = splitChars(h1);
    gsap.set(chars, { yPercent: 110 });
    gsap.to(chars, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.03, delay: 0.15 });
  }

  const rows = container.querySelector('#service-rows');
  if (rows) {
    rows.innerHTML = SERVICES.map((s) => `
      <div class="svc-row" data-reveal>
        <div class="svc-media" data-parallax="10"><img src="${s.image}" alt="${s.alt}" loading="lazy"/></div>
        <div class="svc-copy">
          <span class="svc-num">${s.num}</span>
          <h3 class="serif">${s.title}</h3>
          <p>${s.copy}</p>
          <ul class="svc-list">${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
          <a class="btn btn-dark" href="contact.html" data-magnetic>Enquire <span class="arr">→</span></a>
        </div>
      </div>`).join('');
  }

  const steps = container.querySelector('#process-steps');
  if (steps) {
    steps.innerHTML = STEPS.map((s, i) => `
      <div class="step" data-reveal data-delay="${i * 0.08}">
        <b>0${i + 1}</b><h4>${s.t}</h4><p>${s.d}</p>
      </div>`).join('');
  }

  // Craft stones banner parallax
  const banner = container.querySelector<HTMLImageElement>('#stones-banner');
  if (banner) banner.src = imgCraftStones;

  initReveals(container);
  initMagnetic(container);
}
