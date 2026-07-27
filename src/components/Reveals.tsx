'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll-reveal for every [data-reveal] element on the page.
 *
 * The hidden state is opt-in via `.wbah-reveal` on <body> and is only applied
 * once this runs, so a client without JS never ends up with permanently
 * invisible content. A timer backstop covers the same failure mode when the
 * observer never fires.
 *
 * Re-scans on navigation because App Router keeps the layout mounted across
 * route changes — a mount-only effect would leave later pages hidden.
 */
export default function Reveals() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    document.body.classList.add('wbah-reveal');

    const revealAll = () => els.forEach((el) => el.classList.add('is-visible'));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!els.length || !('IntersectionObserver' in window) || reduced) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 4) * 70}ms`;
      io.observe(el);
    });

    const backstop = window.setTimeout(revealAll, 2600);
    return () => {
      io.disconnect();
      window.clearTimeout(backstop);
    };
  }, [pathname]);

  return null;
}
