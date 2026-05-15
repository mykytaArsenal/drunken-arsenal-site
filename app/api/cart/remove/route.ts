import { NextRequest, NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    await removeFromCart(itemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
