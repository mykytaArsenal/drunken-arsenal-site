'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, MinusIcon, PlusIcon } from './Icons';
import { useRouter } from 'next/navigation';
import type { IProduct } from '@/lib/products';

type IAddToCartButtonProps = {
  product: IProduct;
};

export function AddToCartButton({ product }: IAddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const t = useTranslations('product');
  const tHome = useTranslations('home');

  const handleAddToCart = async () => {
    if (product.stock < quantity) {
      alert('Not enough stock available');
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      router.push('/cart');
    } catch (error) {
      console.error('[v0] Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-stamp text-xs uppercase tracking-[0.15em] text-ink">
          {t('quantity')}
        </span>
        <div className="flex items-stretch border-[3px] border-ink bg-cream shadow-[3px_3px_0_var(--color-ink)]">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center text-ink disabled:opacity-40 media-hover:hover:bg-amber"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-12 flex items-center justify-center font-display text-base text-ink border-x-[3px] border-ink">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="h-10 w-10 flex items-center justify-center text-ink disabled:opacity-40 media-hover:hover:bg-amber"
            aria-label="Increase quantity"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button
        size="lg"
        variant="primary"
        className="w-full"
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAdding}
      >
        <ShoppingCartIcon className="mr-2 h-5 w-5" />
        {isAdding
          ? t('adding')
          : product.stock === 0
            ? tHome('outOfStock')
            : t('addToCart')}
      </Button>
    </div>
  );
}
