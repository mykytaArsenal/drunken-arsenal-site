'use server';

import { stripe } from '@/lib/stripe';
import { clearCart, getCart } from '@/lib/cart';
import { sql } from '@/lib/db';
import { generateId } from '@/lib/id';
import { calcShippingCents } from '@/lib/shipping';

export async function createCheckoutSession() {
  console.log('[v0] Creating checkout session');

  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  let clientSecret: string | null = null;

  try {
    // Create line items from cart
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: `${item.product.name} - Tactical drinking gear`,
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    // Add shipping if needed
    const subtotal = cart.total;
    const shippingFee = calcShippingCents(subtotal);
    if (shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
          },
          unit_amount: shippingFee,
        },
        quantity: 1,
      });
    }

    console.log('[v0] Creating Stripe session with', lineItems.length, 'items');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      redirect_on_completion: 'never',
      line_items: lineItems,
      mode: 'payment',
      metadata: {
        cartId: cart.id,
      },
    });

    console.log('[v0] Stripe session created:', session.id);

    // Create order in database
    const orderId = generateId();
    await sql`
      INSERT INTO "Order" ("id", "email", "total", "status", "stripeSessionId", "createdAt", "updatedAt")
      VALUES (${orderId}, 'pending@checkout.com', ${cart.total + shippingFee}, 'pending', ${session.id}, NOW(), NOW())
    `;

    // Create order items
    for (const item of cart.items) {
      await sql`
        INSERT INTO "OrderItem" ("id", "orderId", "productId", "quantity", "price", "createdAt")
        VALUES (${generateId()}, ${orderId}, ${item.productId}, ${item.quantity}, ${item.product.price}, NOW())
      `;
    }

    console.log('[v0] Order created:', orderId);

    clientSecret = session.client_secret;
  } catch (error: unknown) {
    console.error('[v0] Checkout error:', error);
    const message = error instanceof Error ? error.message : undefined;
    if (message?.includes('relation') && message.includes('does not exist')) {
      throw new Error(
        'Database not initialized. Please run SQL scripts first.'
      );
    }
    throw error;
  }

  if (!clientSecret) {
    throw new Error('Stripe did not return a client secret for the session');
  }

  return clientSecret;
}

export async function checkPaymentStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('[v0] Payment status:', session.payment_status);

    if (session.payment_status === 'paid') {
      // Update order status
      await sql`
        UPDATE "Order"
        SET "status" = 'completed', "email" = ${session.customer_details?.email || 'unknown@email.com'}, "updatedAt" = NOW()
        WHERE "stripeSessionId" = ${sessionId}
      `;

      // Get cart ID from metadata
      const cartId = session.metadata?.cartId;
      if (cartId) {
        await clearCart(cartId);
      }

      return { status: 'complete', email: session.customer_details?.email };
    }

    return { status: session.payment_status };
  } catch (error) {
    console.error('[v0] Error checking payment status:', error);
    throw new Error('Failed to check payment status');
  }
}
