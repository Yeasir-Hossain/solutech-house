import Link from 'next/link';
import type { Item } from '@/lib/types';
import { trimWords } from '@/lib/text';

/**
 * Blog/story card used in archive grids and sliders.
 *
 * Images are plain <img> rather than next/image: every asset was already
 * re-encoded to capped-width WebP during migration, so runtime optimisation
 * would add cost without shrinking anything, and the theme CSS styles the
 * bare element.
 */
export default function Card({ item }: { item: Item }) {
  return (
    <article className="wbah-card" data-reveal>
      <Link className="wbah-card__media" href={item.path} tabIndex={-1} aria-hidden="true">
        {item.featured ? (
          <img
            src={item.featured.src}
            alt=""
            width={item.featured.width}
            height={item.featured.height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="wbah-card__ph" />
        )}
      </Link>
      <div className="wbah-card__body">
        <h3 className="wbah-card__title">
          <Link href={item.path}>{item.title}</Link>
        </h3>
        <p className="wbah-card__excerpt">{trimWords(item.excerpt, 22)}</p>
        <Link className="wbah-card__more" href={item.path}>
          Read more ›
        </Link>
      </div>
    </article>
  );
}
