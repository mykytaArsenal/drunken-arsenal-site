import { NextResponse } from 'next/server';
import { getCart } from '@/lib/cart';

export async function GET() {
  try {
    const cart = await getCart();
    const count =
      cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error('[v0] Error getting cart count:', error);
    return NextResponse.json({ count: 0 });
  }
}
