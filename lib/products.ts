import {
  formatPrice as formatPriceWithCurrency,
  type ICurrency,
} from './currency/config';

/** Fallback image used when a product has no image. */
export const PLACEHOLDER_IMAGE = '/placeholder.svg';

export type IProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Price in cents
  category: 'game' | 'accessory' | 'bundle';
  stock: number;
  images: string[];
  featured: boolean;
  /** When true, the product is shoppable: its card links to the product page. Otherwise it shows "coming soon". */
  available?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const MOCK_PRODUCTS: IProduct[] = [
  {
    id: 'shot-wave-game', // Updated to match database ID
    name: 'Shotwave',
    slug: 'shot-wave-game',
    description:
      'The ultimate tactical drinking game. Deploy your shots, dodge incoming fire, and outmaneuver your opponents in this military-inspired party game.',
    price: 4999,
    category: 'game',
    stock: 100,
    images: [
      '/images/shotwave/1.jpg',
      '/images/shotwave/2.jpg',
      '/images/shotwave/3.jpg',
      '/images/shotwave/4.jpg',
    ],
    featured: true,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'shot-mine',
    name: 'Shot Mine',
    slug: 'shot-mine',
    description:
      'A tactical mine with 8 shot glasses and the Shotwave game inside. Hit the trigger — the mine bursts open and 8 shot-glass petals pop out.',
    price: 0,
    category: 'bundle',
    stock: 0,
    images: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ice-grenade',
    name: 'Ice Grenade',
    slug: 'ice-grenade',
    description:
      'An ice mold shaped like a hand grenade. Chill your drinks with frag-shaped ice.',
    price: 0,
    category: 'accessory',
    stock: 0,
    images: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'artillery-shell-155',
    name: '155mm Shell',
    slug: 'artillery-shell-155',
    description:
      'A case shaped like a 155mm artillery shell: the Shotwave game, a slot for a bottle and 2 shot glasses.',
    price: 0,
    category: 'bundle',
    stock: 0,
    images: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getAllProducts(): Promise<IProduct[]> {
  // Return mock data
  return MOCK_PRODUCTS;
}

export function formatPrice(
  priceInCents: number,
  currency: ICurrency = 'USD'
): string {
  const priceInDollars = priceInCents / 100;
  return formatPriceWithCurrency(priceInDollars, currency);
}
