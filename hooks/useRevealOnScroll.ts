import { useEffect, useRef, useState } from 'react';

type IRevealState = 'pending' | 'visible' | 'hidden' | 'revealed';

export const STAMP_IN =
  'animate-in fade-in zoom-in-150 duration-300 ease-out fill-mode-backwards';

export const SLIDE_UP =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-backwards';

export const useRevealOnScroll = <T extends Element>(rootMargin = '0px') => {
  const ref = useRef<T>(null);
  const [state, setState] = useState<IRevealState>('pending');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setState('hidden');
          return;
        }
        setState((prev) => (prev === 'hidden' ? 'revealed' : 'visible'));
        observer.disconnect();
      },
      { rootMargin, threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, state };
};

export const revealClass = (state: IRevealState, animation: string) => {
  if (state === 'hidden') return 'opacity-0';
  if (state === 'revealed') return animation;
  return undefined;
};

export const hasEnteredView = (state: IRevealState) =>
  state === 'visible' || state === 'revealed';
