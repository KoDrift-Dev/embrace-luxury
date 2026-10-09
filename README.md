# Embrace Luxury

A motion-design showcase site for a fictional high-jewellery maison — deep emerald, champagne gold and ivory, built as a creative interpretation of the reference designs.

## Stack

- **Vite + TypeScript**, multi-page (`index.html`, `shop.html`, `services.html`, `contact.html`)
- **GSAP + ScrollTrigger** — preloader reveal, hero entrance timeline, giant-type parallax, scroll reveals, pinned horizontal-scroll atelier section, marquees, image parallax, magnetic buttons, split-text character animations
- **Lenis** smooth scroll, wired into the GSAP ticker + ScrollTrigger
- **Barba.js** (`@barba/core`) — full-screen emerald curtain wipe with gold rule + script logo between pages; page scripts re-initialise per namespace

## Pages

| Page | Highlights |
|---|---|
| Home | Preloader → hero (giant LUXURY type, hand-with-bracelet, floating glass cards, gold chain divider) → marquee → Our Creations (6 collections) → New In banner → Icon Collections grid → pinned horizontal craft story → testimonials → newsletter footer |
| Shop | Filterable grid (All / Bracelets / Earrings / Rings / Necklaces) with animated transitions, 12 products with PKR prices, working cart |
| Services | Bespoke commissions, restoration, gifting concierge + bespoke journey steps |
| Contact | Boutique info + enquiry form with animated success state (front-end only) |

## Cart

localStorage-backed (`el_cart_v1`), slide-in drawer with quantity steppers, remove, subtotal, and a front-end checkout confirmation with order number. The badge syncs across Barba page transitions.

## Imagery

All imagery is AI-generated, art-directed to the brand palette, and bundled as compressed data URLs in `src/data/images.ts` (tree-shaken per page) — the site makes zero external image requests and stays fully self-contained.

## Develop

```bash
npm install
npm run dev      # multi-page dev server
npm run build    # tsc + vite build → dist/
```

Reduced-motion users get a fully static, accessible experience (no Lenis, no curtain, all content visible). Custom cursor is desktop-pointer only.
