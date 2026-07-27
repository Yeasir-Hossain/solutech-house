'use client';

import Link from 'next/link';
import type { Item } from '@/lib/types';
import { trimWords } from '@/lib/text';
import { useSlider } from './Slider';

interface Props {
  items: Item[];
  eyebrow?: string;
  heading: string;
  copy?: string;
  viewAll?: string;
}

/**
 * Sticky copy column beside a card track that bleeds past the container to the
 * viewport edge. The cut-off card at the right edge is the affordance that
 * there is more to see — it replaces a flat grid of links, which read as a list
 * rather than as content.
 */
export default function StickySlider({ items, eyebrow, heading, copy, viewAll }: Props) {
  const { track, prev, next, atStart, atEnd } = useSlider();
  if (!items.length) return null;

  return (
    <section className="wbah-section wbah-section--alt wbah-stickyslider">
      <div className="wbah-container">
        <div className="wbah-stickyslider__grid">
          <div className="wbah-stickyslider__aside">
            <div className="wbah-stickyslider__sticky">
              <div data-reveal>
                {eyebrow ? <span className="wbah-eyebrow">{eyebrow}</span> : null}
                <h2>{heading}</h2>
                {copy ? <p className="wbah-stickyslider__copy">{copy}</p> : null}
                <div className="wbah-stickyslider__nav">
                  <button
                    type="button"
                    className="wbah-slider__btn wbah-slider__btn--solid"
                    onClick={prev}
                    disabled={atStart}
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="wbah-slider__btn wbah-slider__btn--solid"
                    onClick={next}
                    disabled={atEnd}
                    aria-label="Next"
                  >
                    ›
                  </button>
                </div>
                {viewAll ? (
                  <Link className="wbah-stickyslider__all" href={viewAll}>
                    View all ›
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className="wbah-slider wbah-stickyslider__slider">
            <div className="wbah-slider__track wbah-stickyslider__track" ref={track}>
              {items.map((item, i) => (
                <Link key={item.id} className="wbah-sticky-card" href={item.path}>
                  <span className="wbah-sticky-card__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="wbah-sticky-card__body">
                    <span className="wbah-sticky-card__title">{item.title}</span>
                    <span className="wbah-sticky-card__text">{trimWords(item.excerpt, 34)}</span>
                    <span className="wbah-sticky-card__more">Read more ›</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
