import { sql } from './db';
import { cookies } from 'next/headers';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  total: number;
}

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('cart_session')?.value;

  if (!sessionId) {
    sessionId = generateId() + generateId();
    cookieStore.set('cart_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

export async function getCart(): Promise<Cart | null> {
  const sessionId = await getOrCreateSessionId();

  // Get or create cart
  let carts = await sql`
    SELECT * FROM "Cart"
    WHERE "sessionId" = ${sessionId}
    LIMIT 1
  `;

  if (carts.length === 0) {
    // Create new cart
    const newCarts = await sql`
      INSERT INTO "Cart" ("id", "sessionId", "createdAt", "updatedAt")
      VALUES (${generateId()}, ${sessionId}, NOW(), NOW())
      RETURNING *
    `;
    carts = newCarts;
  }

  const cart = carts[0] as { id: string; sessionId: string };

  // Get cart items with product details
  const items = await sql`
    SELECT 
      ci.*,
      p.id as "product_id",
      p.name as "product_name",
      p.slug as "product_slug",
      p.price as "product_price",
      p.images as "product_images",
      p.stock as "product_stock"
    FROM "CartItem" ci
    JOIN "Product" p ON ci."productId" = p.id
    WHERE ci."cartId" = ${cart.id}
  `;

  interface CartItemRow {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product_id: string;
    product_name: string;
    product_slug: string;
    product_price: number;
    product_images: string[] | null;
    product_stock: number;
  }

  const cartItems: CartItem[] = (items as CartItemRow[]).map((item) => ({
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product_id,
      name: item.product_name,
      slug: item.product_slug,
      price: item.product_price,
      images: item.product_images || [],
      stock: item.product_stock,
    },
  }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    items: cartItems,
    total,
  };
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<void> {
  const sessionId = await getOrCreateSessionId();

  // Get or create cart
  const carts = await sql`
    SELECT * FROM "Cart"
    WHERE "sessionId" = ${sessionId}
    LIMIT 1
  `;

  let cartId: string;

  if (carts.length === 0) {
    const newCarts = await sql`
      INSERT INTO "Cart" ("id", "sessionId", "createdAt", "updatedAt")
      VALUES (${generateId()}, ${sessionId}, NOW(), NOW())
      RETURNING *
    `;
    cartId = (newCarts[0] as { id: string }).id;
  } else {
    cartId = (carts[0] as { id: string }).id;
  }

  // Check if item already exists in cart
  const existingItems = await sql`
    SELECT * FROM "CartItem"
    WHERE "cartId" = ${cartId} AND "productId" = ${productId}
    LIMIT 1
  `;

  if (existingItems.length > 0) {
    // Update quantity
    await sql`
      UPDATE "CartItem"
      SET "quantity" = "quantity" + ${quantity}, "updatedAt" = NOW()
      WHERE "cartId" = ${cartId} AND "productId" = ${productId}
    `;
  } else {
    // Insert new item
    await sql`
      INSERT INTO "CartItem" ("id", "cartId", "productId", "quantity", "createdAt", "updatedAt")
      VALUES (${generateId()}, ${cartId}, ${productId}, ${quantity}, NOW(), NOW())
    `;
  }

  // Update cart timestamp
  await sql`
    UPDATE "Cart"
    SET "updatedAt" = NOW()
    WHERE "id" = ${cartId}
  `;
}

async function getCurrentCartId(): Promise<string | null> {
  const sessionId = await getOrCreateSessionId();
  const carts = await sql`
    SELECT "id" FROM "Cart"
    WHERE "sessionId" = ${sessionId}
    LIMIT 1
  `;
  return carts.length > 0 ? (carts[0] as { id: string }).id : null;
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<void> {
  const cartId = await getCurrentCartId();
  if (!cartId) return;

  if (quantity <= 0) {
    await sql`
      DELETE FROM "CartItem"
      WHERE "id" = ${itemId} AND "cartId" = ${cartId}
    `;
  } else {
    await sql`
      UPDATE "CartItem"
      SET "quantity" = ${quantity}, "updatedAt" = NOW()
      WHERE "id" = ${itemId} AND "cartId" = ${cartId}
    `;
  }
}

export async function removeFromCart(itemId: string): Promise<void> {
  const cartId = await getCurrentCartId();
  if (!cartId) return;

  await sql`
    DELETE FROM "CartItem"
    WHERE "id" = ${itemId} AND "cartId" = ${cartId}
  `;
}

export async function clearCart(cartId: string): Promise<void> {
  await sql`
    DELETE FROM "CartItem"
    WHERE "cartId" = ${cartId}
  `;
}
