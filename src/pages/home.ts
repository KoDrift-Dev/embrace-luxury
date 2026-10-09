import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  REDUCED, splitChars, initReveals, initGroups, initMarquee,
  initParallax, initMagnetic, initFloat, initNav, initMenu, initNewsletter,
} from '../lib/motion';
import { wasPreloaded } from '../lib/preloader';
import { COLLECTIONS, LIFESTYLE } from '../data/products';
import { imgBannerModel, imgHeroHand, imgBraceletEmerald, imgCraftSketch, imgCraftGoldsmith, imgCraftStones } from '../data/images';

gsap.registerPlugin(ScrollTrigger);

function heroIntro() {
  if (REDUCED) return;
  const h1 = document.querySelector('.hero h1.split-target') as HTMLElement | null;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  if (h1) {
    const chars = splitChars(h1); // idempotent — reuses preloader pre-split
    gsap.set(chars, { yPercent: 110 });
    tl.to(chars, { yPercent: 0, duration: 1.1, stagger: 0.028 }, 0.1);
  }
  tl.fromTo('.hero-eyebrow', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.9 }, 0.2)
    .fromTo('.hero-copy', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, 0.55)
    .fromTo('.hero-cta .btn', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.7)
    .fromTo('.hero-meta > div', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.85)
    .fromTo('.hero-img-wrap', { clipPath: 'inset(100% 0 0 0)', scale: 1.06 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.4, ease: 'power4.inOut' }, 0.35)
    .fromTo('.float-card', { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.18, ease: 'back.out(1.4)' }, 1.05)
    .fromTo('.hero-giant', { opacity: 0, letterSpacing: '0.3em' }, { opacity: 1, letterSpacing: '0.04em', duration: 1.6, ease: 'power3.out' }, 0.4)
    .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.4);
}

function heroScrollFX() {
  if (REDUCED) return;
  // Giant type drifts slower + sideways while scrolling away
  gsap.to('.hero-giant', {
    yPercent: 34, xPercent: -6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero-visual', {
    yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero-grid', {
    yPercent: 10, opacity: 0.25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '80% top', scrub: true },
  });
}

/* Pinned horizontal-scroll craft story. */
function craftHorizontal() {
  const pin = document.querySelector('.craft-pin') as HTMLElement | null;
  const track = document.querySelector('.craft-track') as HTMLElement | null;
  if (!pin || !track || REDUCED) return;
  const getX = () => -(track.scrollWidth - window.innerWidth);
  gsap.to(track, {
    x: getX,
    ease: 'none',
    scrollTrigger: {
      trigger: '.craft',
      start: 'top top',
      end: () => '+=' + (track.scrollWidth - window.innerWidth),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
  // Panel images drift slightly against the scroll direction
  track.querySelectorAll('.c-img img').forEach((img) => {
    gsap.fromTo(img, { xPercent: -6 }, {
      xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.craft', start: 'top top', end: 'bottom bottom', scrub: true },
    });
  });
}

function renderCreations() {
  const grid = document.querySelector('#creations-grid');
  if (!grid) return;
  grid.innerHTML = COLLECTIONS.map((c) => `
    <a class="prod-card" href="${c.link}" data-cursor>
      <div class="prod-media"><img src="${c.image}" alt="${c.name} jewellery" loading="lazy"/></div>
      <div class="prod-body">
        <div class="prod-cat">${c.blurb}</div>
        <h3 class="prod-name">${c.name}</h3>
        <div class="prod-foot"><span class="prod-price" style="font-size:1.05rem">Explore →</span></div>
      </div>
    </a>`).join('');
}

function renderLifestyle() {
  const grid = document.querySelector('#lifestyle-grid');
  if (!grid) return;
  grid.innerHTML = LIFESTYLE.map((l) => `
    <div class="coll-tile" data-cursor>
      <img src="${l.image}" alt="${l.title}" loading="lazy"/>
      <div class="coll-cap">
        <div><h4>${l.title}</h4><span>${l.sub}</span></div>
        <span class="coll-arrow">↗</span>
      </div>
    </div>`).join('');
}

export function initHome(container: HTMLElement) {
  renderCreations();
  renderLifestyle();

  // Imagery assigned from the bundled module
  const heroImg = container.querySelector<HTMLImageElement>('#hero-img');
  if (heroImg) heroImg.src = imgHeroHand;
  const bannerImg = container.querySelector<HTMLImageElement>('#newin-img');
  if (bannerImg) bannerImg.src = imgBannerModel;
  const fcThumb = container.querySelector<HTMLImageElement>('#fc-thumb');
  if (fcThumb) fcThumb.src = imgBraceletEmerald;
  const craftImgs: Record<string, string> = { sketch: imgCraftSketch, goldsmith: imgCraftGoldsmith, stones: imgCraftStones };
  container.querySelectorAll<HTMLImageElement>('img[data-craft]').forEach((img) => {
    const key = img.dataset.craft || '';
    if (craftImgs[key]) img.src = craftImgs[key];
  });

  initNav();
  initMenu();
  initNewsletter(container);
  initReveals(container);
  initGroups(container);
  initMarquee(container);
  initParallax(container);
  initMagnetic(container);
  initFloat(container);
  heroScrollFX();
  craftHorizontal();

  // Section titles: split + rise on scroll
  if (!REDUCED) {
    container.querySelectorAll<HTMLElement>('.split-scroll').forEach((el) => {
      const chars = splitChars(el);
      gsap.set(chars, { yPercent: 110 });
      gsap.to(chars, {
        yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.02,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });
  }

  // Hero intro plays after the preloader lifts (or immediately on soft nav)
  if (wasPreloaded() || REDUCED) {
    heroIntro();
  } else {
    // Pre-hide animated hero elements so nothing flashes behind the preloader
    gsap.set('.hero-eyebrow, .hero-copy, .hero-cta .btn, .hero-meta > div, .float-card, .hero-scroll', { opacity: 0 });
    gsap.set('.hero-img-wrap', { clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.hero-giant', { opacity: 0 });
    const h1 = container.querySelector('.hero h1.split-target') as HTMLElement | null;
    if (h1) gsap.set(splitChars(h1), { yPercent: 110 });
    window.addEventListener('el:ready', heroIntro, { once: true });
  }

}
