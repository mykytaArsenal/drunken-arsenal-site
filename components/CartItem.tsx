'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MinusIcon, PlusIcon, XIcon } from './Icons';
import { formatPrice } from '@/lib/products';
import type { ICartItem } from '@/lib/cart';
import type { ICurrency } from '@/lib/currency/config';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ICartItemComponentProps = {
  item: ICartItem;
  currency: ICurrency;
};

export function CartItemComponent({ item, currency }: ICartItemComponentProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const t = useTranslations('cart');

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0 || newQuantity > item.product.stock) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, quantity: newQuantity }),
      });

      if (!response.ok) throw new Error('Failed to update cart');

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (!response.ok) throw new Error('Failed to remove item');

      router.refresh();
    } catch (error) {
      console.error('[v0] Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="pop-card p-4 flex gap-4 items-stretch">
      <Link
        href={`/product/${item.product.slug}`}
        className="flex-shrink-0 w-24 h-24 bg-cream-warm border-2 border-ink overflow-hidden"
      >
        <Image
          src={item.product.images[0] || '/placeholder.svg'}
          alt={item.product.name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/product/${item.product.slug}`}
            className="hover:text-rust-bright transition-colors"
          >
            <h3 className="font-display text-base md:text-lg text-ink uppercase line-clamp-1">
              {item.product.name}
            </h3>
          </Link>
          <p className="font-stamp text-xs text-ink/70 mt-1">
            {formatPrice(item.product.price, currency)} {t('each')}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
          <div className="flex items-stretch border-2 border-ink bg-cream">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8 flex items-center justify-center disabled:opacity-40 media-hover:hover:bg-amber"
              aria-label="Decrease"
            >
              <MinusIcon className="h-3 w-3" />
            </button>
            <span className="w-10 flex items-center justify-center font-display text-sm border-x-2 border-ink">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={isUpdating || quantity >= item.product.stock}
              className="h-8 w-8 flex items-center justify-center disabled:opacity-40 media-hover:hover:bg-amber"
              aria-label="Increase"
            >
              <PlusIcon className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-display text-lg text-rust-bright">
              {formatPrice(item.product.price * quantity, currency)}
            </p>
            <button
              type="button"
              onClick={removeItem}
              disabled={isUpdating}
              className="h-8 w-8 flex items-center justify-center text-ink/70 media-hover:hover:text-rust-bright disabled:opacity-40"
              aria-label="Remove item"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
