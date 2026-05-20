import {
  formatPrice as formatPriceWithCurrency,
  type ICurrency,
} from './currency/config';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Price in cents
  category: 'game' | 'accessory' | 'bundle';
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    images: ['/tactical-drinking-game-board.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'artillery-shells-6pack', // Updated to match database ID
    name: 'Artillery Shells - 6 Pack',
    slug: 'artillery-shells-6pack',
    description:
      'Premium shot glass shells designed for maximum impact. Rugged construction for intense party operations.',
    price: 1499,
    category: 'accessory',
    stock: 200,
    images: ['/artillery-shell-shot-glasses.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tactical-mines-4pack', // Updated to match database ID
    name: 'Tactical Mines - 4 Pack',
    slug: 'tactical-mines-4pack',
    description:
      'Strategic drinking obstacles. Place these tactical mines on the battlefield and watch your opponents navigate carefully.',
    price: 999,
    category: 'accessory',
    stock: 180,
    images: ['/military-tactical-mine-coasters.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'full-arsenal-bundle', // Updated to match database ID
    name: 'Full Arsenal Bundle',
    slug: 'full-arsenal-bundle',
    description:
      'Go all in. Shotwave game + 12 Artillery Shells + 4 Tactical Mines. Complete tactical superiority. Save 20%.',
    price: 7999,
    category: 'bundle',
    stock: 50,
    images: ['/tactical-drinking-game-bundle.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'artillery-shells-12pack', // Added to match database
    name: 'Artillery Shells - 12 Pack',
    slug: 'artillery-shells-12pack',
    description:
      'Double the firepower. Stock up for extended missions with this tactical 12-pack of premium shot glass shells.',
    price: 2499,
    category: 'accessory',
    stock: 150,
    images: ['/game-expansion-cards.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'basic-deployment-bundle', // Added to match database
    name: 'Basic Deployment Bundle',
    slug: 'basic-deployment-bundle',
    description:
      'Everything you need for your first mission: Shotwave game + 6 Artillery Shells. Save 15% compared to buying separately.',
    price: 5999,
    category: 'bundle',
    stock: 75,
    images: ['/sniper-rifle-shot-glass.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getAllProducts(): Promise<IProduct[]> {
  // Return mock data
  return MOCK_PRODUCTS;
}

export async function getFeaturedProducts(): Promise<IProduct[]> {
  return MOCK_PRODUCTS.filter((p) => p.featured);
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<IProduct | null> {
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

export function formatPrice(
  priceInCents: number,
  currency: ICurrency = 'USD'
): string {
  const priceInDollars = priceInCents / 100;
  return formatPriceWithCurrency(priceInDollars, currency);
}
