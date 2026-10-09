import { PRODUCTS, pkr, type Product } from '../data/products';
import { stopScroll, startScroll } from './motion';

const KEY = 'el_cart_v1';

export interface CartLine { id: string; qty: number; }

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(l => l && typeof l.id === 'string') : [];
  } catch { return []; }
}

function write(lines: CartLine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
}

export function productById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function cartLines(): CartLine[] { return read(); }

export function cartCount(): number {
  return read().reduce((s, l) => s + l.qty, 0);
}

export function cartTotal(): number {
  return read().reduce((s, l) => {
    const p = productById(l.id);
    return s + (p ? p.price * l.qty : 0);
  }, 0);
}

export function addToCart(id: string, qty = 1) {
  const lines = read();
  const line = lines.find(l => l.id === id);
  if (line) line.qty += qty; else lines.push({ id, qty });
  write(lines);
  updateBadge();
  const p = productById(id);
  toast(p ? `Added to bag — ${p.name}` : 'Added to bag');
}

export function setQty(id: string, qty: number) {
  let lines = read();
  if (qty <= 0) lines = lines.filter(l => l.id !== id);
  else {
    const line = lines.find(l => l.id === id);
    if (line) line.qty = qty;
  }
  write(lines);
  updateBadge();
  renderDrawer();
}

export function removeLine(id: string) { setQty(id, 0); }

export function clearCart() { write([]); updateBadge(); renderDrawer(); }

/* ---------- badge ---------- */
export function updateBadge() {
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = String(cartCount());
  });
}

/* ---------- toast ---------- */
let toastTimer: number | undefined;
export function toast(msg: string) {
  let t = document.querySelector('.toast') as HTMLElement | null;
  if (!t) return;
  t.querySelector('.t-msg')!.textContent = msg;
  t.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t!.classList.remove('show'), 2600);
}

/* ---------- drawer ---------- */
function ensureChrome() {
  if (!document.querySelector('.cart-backdrop')) {
    const bd = document.createElement('div');
    bd.className = 'cart-backdrop';
    bd.addEventListener('click', closeDrawer);
    document.body.appendChild(bd);
  }
  if (!document.querySelector('.cart-drawer')) {
    const d = document.createElement('aside');
    d.className = 'cart-drawer';
    d.setAttribute('aria-label', 'Shopping bag');
    document.body.appendChild(d);
  }
  if (!document.querySelector('.toast')) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="t-dot"></span><span class="t-msg"></span>';
    document.body.appendChild(t);
  }
}

export function openDrawer() {
  ensureChrome();
  renderDrawer();
  document.querySelector('.cart-backdrop')!.classList.add('open');
  document.querySelector('.cart-drawer')!.classList.add('open');
  stopScroll();
}

export function closeDrawer() {
  document.querySelector('.cart-backdrop')?.classList.remove('open');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  startScroll();
}

export function renderDrawer() {
  const d = document.querySelector('.cart-drawer') as HTMLElement | null;
  if (!d) return;
  const lines = read();
  if (!lines.length) {
    d.innerHTML = `
      <div class="cart-head"><h3>Your Bag</h3><button class="cart-close" data-close aria-label="Close">×</button></div>
      <div class="cart-items"><div class="cart-empty">
        <span class="script">Embrace</span>
        Your bag is empty.<br/>Discover pieces made to be kept forever.
      </div></div>
      <div class="cart-foot"><button class="btn btn-dark" data-close style="width:100%;justify-content:center">Continue Browsing</button></div>`;
  } else {
    const rows = lines.map(l => {
      const p = productById(l.id);
      if (!p) return '';
      return `
      <div class="cart-item" data-line="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy"/>
        <div>
          <div class="ci-name">${p.name}</div>
          <div class="ci-price">${pkr(p.price)}</div>
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Decrease">−</button>
            <span>${l.qty}</span>
            <button data-inc="${p.id}" aria-label="Increase">+</button>
          </div>
          <button class="ci-remove" data-remove="${p.id}">Remove</button>
        </div>
        <div class="ci-price">${pkr(p.price * l.qty)}</div>
      </div>`;
    }).join('');
    d.innerHTML = `
      <div class="cart-head"><h3>Your Bag <span style="font-size:1rem;color:var(--gold-deep)">(${cartCount()})</span></h3><button class="cart-close" data-close aria-label="Close">×</button></div>
      <div class="cart-items">${rows}</div>
      <div class="cart-foot">
        <div class="cart-total"><span>Subtotal</span><b>${pkr(cartTotal())}</b></div>
        <button class="btn btn-gold" data-checkout>Proceed to Checkout <span class="arr">→</span></button>
        <p class="cart-note">Complimentary insured delivery across Pakistan.</p>
      </div>`;
  }
  d.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeDrawer));
  d.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => {
    const id = (b as HTMLElement).dataset.inc!;
    const l = read().find(x => x.id === id);
    setQty(id, (l?.qty ?? 0) + 1);
  }));
  d.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => {
    const id = (b as HTMLElement).dataset.dec!;
    const l = read().find(x => x.id === id);
    setQty(id, (l?.qty ?? 1) - 1);
  }));
  d.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeLine((b as HTMLElement).dataset.remove!)));
  d.querySelector('[data-checkout]')?.addEventListener('click', checkout);
}

function checkout() {
  const d = document.querySelector('.cart-drawer') as HTMLElement | null;
  if (!d) return;
  const orderId = 'EL-' + Math.floor(100000 + Math.random() * 900000);
  const total = pkr(cartTotal());
  clearCart();
  d.innerHTML = `
    <div class="cart-head"><h3>Order Confirmed</h3><button class="cart-close" data-close aria-label="Close">×</button></div>
    <div class="cart-items"><div class="order-ok">
      <div class="ok-ring">✓</div>
      <h3 class="serif" style="font-size:1.8rem;margin-bottom:.5rem">Thank you.</h3>
      <p style="color:var(--ink-soft);font-weight:300">Order <b>${orderId}</b> is confirmed.<br/>Total <b>${total}</b> — our concierge will call you shortly.</p>
    </div></div>
    <div class="cart-foot"><button class="btn btn-dark" data-close style="width:100%;justify-content:center">Continue Browsing</button></div>`;
  d.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeDrawer));
}

/* global delegation for [data-add] buttons rendered anywhere */
export function initCartGlobal() {
  ensureChrome();
  updateBadge();
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('[data-add]') as HTMLElement | null;
    if (t) { addToCart(t.dataset.add!); return; }
    const c = (e.target as HTMLElement).closest('[data-open-cart]') as HTMLElement | null;
    if (c) { openDrawer(); return; }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}
