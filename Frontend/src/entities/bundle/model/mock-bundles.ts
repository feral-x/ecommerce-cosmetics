import type { Bundle } from './types'

export const mockBundles: Bundle[] = [
  {
    id: 'j-beauty-first-ritual',
    title: 'First J-Beauty Ritual',
    brandLabel: 'Hanami curation',
    summary:
      'Double cleanse, prep, hydrate, and protect — the four steps every guide starts with.',
    description:
      'This set is for anyone opening a J-Beauty shelf for the first time. You get full-size staples that work together, not random minis: an oil cleanser that melts sunscreen, a low-pH foam, a lotion that layers like water, and a modern gel SPF you will actually finish. We include a simple evening vs. morning card so you are never guessing which step comes next. All formulas are fragrance-light or fragrance-free, suited to combination and normal skin.',
    price: 72,
    compareAtPrice: 94,
    stockLimit: 12,
    cartProductIds: ['5', '7', '9', '12'],
    items: [
      {
        productId: '5',
        label: 'Cleansing oil',
        description:
          'First cleanse — dissolves SPF and makeup without stripping.',
      },
      {
        productId: '7',
        label: 'Hydrating foam',
        description: 'Second cleanse with a cushiony, skin-neutral pH.',
      },
      {
        productId: '9',
        label: 'Gokujyun lotion',
        description: 'Pat-in hydration that preps skin for serum and cream.',
      },
      {
        productId: '12',
        label: 'UV Aqua Rich SPF',
        description: 'Weightless daily sunscreen, no white cast.',
      },
    ],
  },
  {
    id: 'shiseido-travel-icons',
    title: 'Shiseido Travel Icons',
    brandLabel: 'Shiseido',
    summary:
      'Airport-friendly sizes of bestsellers — cleanse, treat, defend in one pouch.',
    description:
      'Built for carry-on limits and two-week trips. The cleansing bridge works in hard water, Ultimune keeps skin calm after long flights, and the Anessa mini is the same trusted milk Japanese pharmacies stock every summer. Everything ships in a reusable cotton pouch that fits a quart bag. If you already love Shiseido at home, this is the least stressful way to stay on routine abroad.',
    price: 55,
    compareAtPrice: 71,
    stockLimit: 8,
    cartProductIds: ['46'],
    items: [
      {
        productId: '2',
        label: 'Ultimune mini',
        description: 'Pre-serum to support barrier and even tone.',
      },
      {
        productId: '4',
        label: 'Perfect Whip travel',
        description: 'Iconic creamy cleanser in a plane-safe tube.',
      },
      {
        productId: '6',
        label: 'Anessa UV milk mini',
        description: 'Water-resistant SPF 50+ for face and neck.',
      },
      {
        productId: '46',
        label: 'Cotton travel pouch',
        description: 'Keeps the set together — also sold as standalone kit.',
      },
    ],
  },
  {
    id: 'hydration-heroes',
    title: 'Hydration Heroes',
    brandLabel: 'Hada Labo × Naturie',
    summary:
      'Plumping layers for dry office air — lotion, gel, and barrier support.',
    description:
      'When heat or AC leaves skin tight by afternoon, this trio rebuilds moisture in thin layers instead of one heavy cream. Hada Labo lotion brings multiple weights of hyaluronic acid; Naturie gel seals without grease; the included sheet mask is the weekly reset. The routine is intentionally minimal so you can keep using your favorite cleanser and SPF.',
    price: 42,
    compareAtPrice: 54,
    stockLimit: 15,
    cartProductIds: ['57'],
    items: [
      {
        productId: '9',
        label: 'Premium lotion',
        description: 'Several HA weights for lasting, bouncy hydration.',
      },
      {
        productId: '14',
        label: 'Naturie gel',
        description: 'Aloe-based gel cream — popular “one step” in Japan.',
      },
      {
        productId: '11',
        label: 'Lululun mask pack',
        description: 'Weekly moisture boost; share-friendly sheets.',
      },
    ],
  },
  {
    id: 'sun-recovery-pair',
    title: 'Sun & Recovery Pair',
    brandLabel: 'Biore × KOSÉ',
    summary: 'City SPF plus after-sun comfort when you stay out late.',
    description:
      'Morning is Biore’s weightless gel — high protection, zero stickiness under makeup. Evening is a cooling aloe gel for neck and shoulders when you have been walking all day. The lip balm closes the loop for often-forgotten SPF touch-ups. Designed for humid summers and weekend travel, not poolside resort kits.',
    price: 38,
    compareAtPrice: 49,
    stockLimit: 20,
    cartProductIds: ['58'],
    items: [
      {
        productId: '12',
        label: 'UV Aqua Rich',
        description: 'Everyday face and body gel SPF.',
      },
      {
        productId: '17',
        label: 'Aloe bath essence',
        description: 'Soothing post-sun body care with light citrus.',
      },
      {
        productId: '22',
        label: 'SPF lip treatment',
        description: 'Prevents burnt lips on scooter-and-cafe days.',
      },
    ],
  },
]
