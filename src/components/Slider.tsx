'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Horizontal card-track controller.
 *
 * The arrows do not always live inside the scroll container — the sticky
 * slider puts them in the copy column — so the control state is lifted into a
 * hook rather than being resolved by DOM traversal from the track.
 */
export function useSlider() {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // Tolerance rather than 0: the track carries a few px of inline padding, so
    // its resting scrollLeft is never exactly 0.
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const step = () => {
    const el = track.current;
    const card = el?.children[0] as HTMLElement | undefined;
    if (!el || !card) return 320;
    const styles = getComputedStyle(el);
    const gap = parseInt(styles.columnGap || styles.gap || '0', 10) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const scrollBy = (dir: 1 | -1) =>
    track.current?.scrollBy({ left: dir * step(), behavior: 'smooth' });

  return {
    track,
    atStart,
    atEnd,
    prev: () => scrollBy(-1),
    next: () => scrollBy(1),
  };
}
