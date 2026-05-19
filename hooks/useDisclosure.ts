import { SyntheticEvent, useCallback, useState } from 'react';

export const useDisclosure = (defaultState = false) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback((evt?: SyntheticEvent) => {
    if (evt) {
      evt.stopPropagation();
    }
    setIsOpen(false);
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
