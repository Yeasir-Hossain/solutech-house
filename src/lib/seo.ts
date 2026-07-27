import type { Metadata } from 'next';
import type { Item } from './types';
import { stripTags, trimWords } from './text';

/**
 * Metadata for a content item — the Next equivalent of the old wbah-core/seo.php:
 * description from the excerpt (falling back to the body), canonical from the
 * item's own path, and OG/Twitter cards using the featured image.
 */
export function itemMetadata(item: Item, type: 'article' | 'website' = 'website'): Metadata {
  const description = trimWords(stripTags(item.excerpt || item.content), 30);
  const images = item.featured
    ? [{ url: item.featured.src, width: item.featured.width, height: item.featured.height, alt: item.featured.alt }]
    : undefined;

  return {
    title: item.title,
    description,
    alternates: { canonical: item.path },
    openGraph: {
      title: item.title,
      description,
      url: item.path,
      type,
      images,
      ...(type === 'article'
        ? { publishedTime: item.date, modifiedTime: item.modified }
        : {}),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: item.title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}
