'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, XIcon } from './icons';
import { formatPrice } from '@/lib/products';
import type { ICartItem } from '@/lib/cart';
import type { ICurrency } from '@/lib/currency/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ICartItemComponentProps {
  item: ICartItem;
  currency: ICurrency;
}

export function CartItemComponent({ item, currency }: ICartItemComponentProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0 || newQuantity > item.product.stock) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      setQuantity(newQuantity);
      router.refresh();
    } catch (error) {
      console.error('[v0] Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      router.refresh();
    } catch (error) {
      console.error('[v0] Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4 flex gap-4">
      {/* Product Image */}
      <Link
        href={`/product/${item.product.slug}`}
        className="flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden"
      >
        <img
          src={item.product.images[0] || '/placeholder.svg'}
          alt={item.product.name}
          className="object-cover w-full h-full"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.product.slug}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg">{item.product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {formatPrice(item.product.price, currency)} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8"
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={isUpdating || quantity >= item.product.stock}
              className="h-8 w-8"
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>

          {/* Subtotal */}
          <div className="flex items-center gap-4">
            <p className="font-bold text-lg">
              {formatPrice(item.product.price * quantity, currency)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeItem}
              disabled={isUpdating}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
