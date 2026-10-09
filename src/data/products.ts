import {
  imgBraceletEmerald, imgEarringsClover, imgRingDiamond, imgEarringsKnot,
  imgBraceletTurquoise, imgEarringsHoop, imgNecklaceEmerald, imgNecklaceChain,
  imgLifeNecklace, imgLifeHands, imgLifeLeaf, imgLifeBangles, imgLifeEarrings, imgLifeChain,
} from './images';

export type Category = 'Bracelets' | 'Earrings' | 'Rings' | 'Necklaces';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // PKR
  image: string;
  desc: string;
  tag?: string;
}

export const CATEGORIES: Array<'All' | Category> = ['All', 'Bracelets', 'Earrings', 'Rings', 'Necklaces'];

export const PRODUCTS: Product[] = [
  {
    id: 'radiant-bloom',
    name: 'Radiant Bloom Bracelet',
    category: 'Bracelets',
    price: 485000,
    image: imgBraceletEmerald,
    desc: 'Emerald-cut emeralds and brilliant diamonds set in 18k gold — our signature piece.',
    tag: 'Signature',
  },
  {
    id: 'aurelia-bangle',
    name: 'Aurelia Gold Bangle',
    category: 'Bracelets',
    price: 265000,
    image: imgLifeBangles,
    desc: 'A sculpted stack of polished gold bangles, made to be worn every day.',
  },
  {
    id: 'turquoise-chain',
    name: 'Turquoise Chain Bracelet',
    category: 'Bracelets',
    price: 198000,
    image: imgBraceletTurquoise,
    desc: 'Hand-set turquoise beads on a fine gold chain — a quiet pop of colour.',
  },
  {
    id: 'verde-clover',
    name: 'Verde Clover Drops',
    category: 'Earrings',
    price: 145000,
    image: imgEarringsClover,
    desc: 'Clover motifs in green enamel and gold, swaying with every step.',
    tag: 'New',
  },
  {
    id: 'knot-studs',
    name: 'Knot Stud Earrings',
    category: 'Earrings',
    price: 98000,
    image: imgEarringsKnot,
    desc: 'A bold sculptural knot in mirror-polished yellow gold.',
  },
  {
    id: 'emerald-beam',
    name: 'Emerald Beam Hoops',
    category: 'Earrings',
    price: 175000,
    image: imgEarringsHoop,
    desc: 'Modern hoops finished with deep-green emerald drops.',
  },
  {
    id: 'bloom-ring',
    name: 'Bloom Diamond Ring',
    category: 'Rings',
    price: 220000,
    image: imgRingDiamond,
    desc: 'A brilliant diamond cradled in delicate gold filigree.',
    tag: 'Iconic',
  },
  {
    id: 'emerald-halo-ring',
    name: 'Emerald Halo Ring',
    category: 'Rings',
    price: 310000,
    image: imgLifeHands,
    desc: 'A vivid emerald encircled by pavé diamonds. Made to be noticed.',
  },
  {
    id: 'sculpt-band',
    name: 'Sculpted Gold Band',
    category: 'Rings',
    price: 132000,
    image: imgLifeChain,
    desc: 'An architectural band with a satin finish — understated luxury.',
  },
  {
    id: 'riviera-necklace',
    name: 'Riviera Emerald Necklace',
    category: 'Necklaces',
    price: 620000,
    image: imgNecklaceEmerald,
    desc: 'A river of emeralds and diamonds. Our most celebrated creation.',
    tag: 'Signature',
  },
  {
    id: 'clover-pendant',
    name: 'Clover Pendant',
    category: 'Necklaces',
    price: 185000,
    image: imgNecklaceChain,
    desc: 'A delicate layered chain with a signature clover pendant.',
  },
  {
    id: 'cascade-necklace',
    name: 'Cascade Chain Necklace',
    category: 'Necklaces',
    price: 275000,
    image: imgLifeNecklace,
    desc: 'Cascading gold links set with emeralds and rubies.',
  },
];

export interface Collection {
  name: string;
  blurb: string;
  image: string;
  link: string;
}

export const COLLECTIONS: Collection[] = [
  { name: 'Bracelets', blurb: 'Cuffs, chains & bangles', image: imgBraceletEmerald, link: 'shop.html?cat=Bracelets' },
  { name: 'Earrings', blurb: 'Drops, hoops & studs', image: imgEarringsClover, link: 'shop.html?cat=Earrings' },
  { name: 'Rings', blurb: 'Solitaires & bands', image: imgRingDiamond, link: 'shop.html?cat=Rings' },
  { name: 'Tiffany Knot', blurb: 'The sculptural edit', image: imgEarringsKnot, link: 'shop.html?cat=Earrings' },
  { name: 'Turquoise', blurb: 'A sea-green reverie', image: imgBraceletTurquoise, link: 'shop.html?cat=Bracelets' },
  { name: 'HardWear', blurb: 'Bold industrial gold', image: imgEarringsHoop, link: 'shop.html?cat=Earrings' },
];

export const LIFESTYLE = [
  { title: 'High Necklaces', sub: 'The Riviera Edit', image: imgLifeNecklace },
  { title: 'Hands Adorned', sub: 'Rings & Rituals', image: imgLifeHands },
  { title: 'Garden Bloom', sub: 'Diamond Florals', image: imgLifeLeaf },
  { title: 'The Stack', sub: 'Bangles, Layered', image: imgLifeBangles },
  { title: 'Night Emeralds', sub: 'After-Dark Drops', image: imgLifeEarrings },
  { title: 'Chain Language', sub: 'Links & Stations', image: imgLifeChain },
];

export function pkr(n: number): string {
  return 'PKR ' + n.toLocaleString('en-US');
}
