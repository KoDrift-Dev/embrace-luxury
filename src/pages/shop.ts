import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS, CATEGORIES, pkr, type Category } from '../data/products';
import { REDUCED, initReveals, initMagnetic, initNav, initMenu, initNewsletter, splitChars } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

let current: 'All' | Category = 'All';

function cardHTML(id: string, name: string, category: Category, price: number, image: string, desc: string, tag?: string) {
  return `
  <article class="prod-card" data-id="${id}">
    <div class="prod-media">
      ${tag ? `<span class="prod-tag">${tag}</span>` : ''}
      <img src="${image}" alt="${name}" loading="lazy"/>
    </div>
    <div class="prod-body">
      <div class="prod-cat">${category}</div>
      <h3 class="prod-name">${name}</h3>
      <p class="prod-desc">${desc}</p>
      <div class="prod-foot">
        <span class="prod-price">${pkr(price)}</span>
        <button class="prod-add" data-add="${id}" data-cursor>Add to Bag <span>→</span></button>
      </div>
    </div>
  </article>`;
}

function renderGrid(animate: boolean) {
  const grid = document.querySelector('#shop-grid') as HTMLElement | null;
  const count = document.querySelector('#shop-count');
  if (!grid) return;
  const list = current === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === current);
  if (count) count.textContent = `${list.length} piece${list.length === 1 ? '' : 's'} ${current === 'All' ? 'in the boutique' : `in ${current}`}`;

  const apply = () => {
    grid.innerHTML = list.map(p => cardHTML(p.id, p.name, p.category, p.price, p.image, p.desc, p.tag)).join('');
    if (animate && !REDUCED) {
      gsap.fromTo(grid.children,
        { opacity: 0, y: 36, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 });
    } else {
      gsap.set(grid.children, { opacity: 1 });
    }
  };

  if (animate && !REDUCED && grid.children.length) {
    gsap.to(grid.children, {
      opacity: 0, y: 24, scale: 0.98, duration: 0.32, ease: 'power2.in', stagger: 0.03,
      onComplete: apply,
    });
  } else apply();
}

function initFilters() {
  const wrap = document.querySelector('#filters');
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(c =>
    `<button class="filter-pill${c === current ? ' active' : ''}" data-filter="${c}">${c}</button>`).join('');
  wrap.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = (btn as HTMLElement).dataset.filter as 'All' | Category;
      if (next === current) return;
      current = next;
      wrap.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b === btn));
      if (!REDUCED) {
        gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
      }
      renderGrid(true);
    });
  });
}

export function initShop(container: HTMLElement) {
  // Preselect category from ?cat=
  const cat = new URLSearchParams(window.location.search).get('cat') as Category | null;
  current = (cat && (CATEGORIES as string[]).includes(cat)) ? cat : 'All';

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

  initFilters();
  renderGrid(false);
  initReveals(container);
}
