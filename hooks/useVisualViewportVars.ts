import { useEffect } from 'react';

export function useVisualViewportVars(active = true) {
  useEffect(() => {
    if (!active) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const root = document.documentElement;

    const apply = () => {
      const height = vv.height;
      // Small gutter so the modal never touches the viewport edges.
      root.style.setProperty('--dialog-maxh', `${Math.round(height - 16)}px`);
      root.style.setProperty(
        '--dialog-top',
        `${Math.round(vv.offsetTop + height / 2)}px`
      );
    };

    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);

    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      root.style.removeProperty('--dialog-maxh');
      root.style.removeProperty('--dialog-top');
    };
  }, [active]);
}
