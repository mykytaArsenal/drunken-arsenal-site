'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

/**
 * Slightly larger, static arrow buttons: the circle and glyph are bumped up and
 * the brutalist hover/active shift is neutralised so the arrows stay put.
 */
const ARROW_CLASSES = cn(
  'size-10 border-ink bg-cream text-ink shadow-[3px_3px_0_var(--color-ink)]',
  'media-hover:hover:translate-x-0 media-hover:hover:translate-y-0 media-hover:hover:shadow-[3px_3px_0_var(--color-ink)]',
  'active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_var(--color-ink)]'
);

type IProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: IProductGalleryProps) {
  const slides = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const hasMultiple = slides.length > 1;

  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} opts={{ loop: hasMultiple }} className="w-full">
        <CarouselContent>
          {slides.map((image, index) => (
            <CarouselItem key={index}>
              <div className="pop-card aspect-square overflow-hidden">
                <Image
                  src={image || PLACEHOLDER_IMAGE}
                  alt={index === 0 ? name : `${name} — ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {hasMultiple && (
          <>
            <CarouselPrevious className={cn('left-3', ARROW_CLASSES)} />
            <CarouselNext className={cn('right-3', ARROW_CLASSES)} />
          </>
        )}
      </Carousel>

      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {slides.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`${name} — image ${index + 1}`}
              aria-current={selected === index}
              className={cn(
                'pop-card aspect-square w-20 shrink-0 overflow-hidden transition-opacity',
                selected === index
                  ? 'ring-2 ring-rust-bright ring-offset-2 ring-offset-paper'
                  : 'opacity-60 media-hover:hover:opacity-100'
              )}
            >
              <Image
                src={image || PLACEHOLDER_IMAGE}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
