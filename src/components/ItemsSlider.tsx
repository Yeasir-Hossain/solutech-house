'use client';

import Link from 'next/link';
import type { Item } from '@/lib/types';
import Card from './Card';
import { useSlider } from './Slider';

interface Props {
  items: Item[];
  eyebrow?: string;
  heading: string;
  viewAll?: string;
}

/** Section head with prev/next arrows above a horizontally scrolling card track. */
export default function ItemsSlider({ items, eyebrow, heading, viewAll }: Props) {
  const { track, prev, next, atStart, atEnd } = useSlider();
  if (!items.length) return null;

  return (
    <>
      <div className="wbah-slider-head" data-reveal>
        <div className="wbah-section-intro wbah-section-intro--left">
          {eyebrow ? <span className="wbah-eyebrow">{eyebrow}</span> : null}
          <h2>{heading}</h2>
        </div>
        <div className="wbah-slider__nav">
          {viewAll ? (
            <Link className="wbah-btn wbah-btn--ghost-dark wbah-btn--sm" href={viewAll}>
              View all
            </Link>
          ) : null}
          <button
            type="button"
            className="wbah-slider__btn"
            onClick={prev}
            disabled={atStart}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="wbah-slider__btn"
            onClick={next}
            disabled={atEnd}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
      <div className="wbah-slider" data-reveal>
        <div className="wbah-slider__track" ref={track}>
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
