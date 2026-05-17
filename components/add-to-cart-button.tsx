'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, MinusIcon, PlusIcon } from './icons';
import { useRouter } from 'next/navigation';
import type { IProduct } from '@/lib/products';

interface IAddToCartButtonProps {
  product: IProduct;
}

export function AddToCartButton({ product }: IAddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

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

      // Redirect to cart page
      router.push('/cart');
    } catch (error) {
      console.error('[v0] Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <MinusIcon className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="h-10 w-10"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAdding}
      >
        <ShoppingCartIcon className="mr-2 h-5 w-5" />
        {isAdding
          ? 'Adding...'
          : product.stock === 0
            ? 'Out of Stock'
            : 'Add to Cart'}
      </Button>
    </div>
  );
}
