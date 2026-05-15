import { NextRequest, NextResponse } from 'next/server';
import { updateCartItemQuantity } from '@/lib/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Invalid item ID or quantity' },
        { status: 400 }
      );
    }

    await updateCartItemQuantity(itemId, quantity);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
