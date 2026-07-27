import type { MetadataRoute } from 'next';
import { getAll, getCategories, getPosts } from '@/lib/content';
import { PAGE_SIZE } from '@/lib/paging';
import { SITE_URL } from '@/lib/site';

/** Pages excluded from search: utility, legal and thank-you routes. */
const NOINDEX = /(privacy|cookie|terms|acceptable-use|complaints|thank-you|ebook|referral|disclaimer)/;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;
  const entries: MetadataRoute.Sitemap = [];

  entries.push({ url: url('/'), changeFrequency: 'weekly', priority: 1 });

  for (const path of [
    '/blog/',
    '/faqs/',
    '/success-stories/',
    '/sell-house-fast/',
    '/reasons-to-sell/',
    '/get-a-valuation/',
  ]) {
    entries.push({ url: url(path), changeFrequency: 'weekly', priority: 0.8 });
  }

  // Blog pagination.
  const postCount = getPosts().length;
  for (let page = 2; page <= Math.ceil(postCount / PAGE_SIZE); page++) {
    entries.push({ url: url(`/blog/page/${page}/`), changeFrequency: 'weekly', priority: 0.3 });
  }

  for (const category of getCategories()) {
    entries.push({
      url: url(`/blog/category/${category.slug}/`),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  for (const type of ['post', 'faq', 'success_story', 'location', 'reason'] as const) {
    for (const item of getAll(type)) {
      entries.push({
        url: url(item.path),
        lastModified: new Date(item.modified),
        changeFrequency: type === 'post' ? 'monthly' : 'weekly',
        priority: type === 'post' ? 0.6 : 0.7,
      });
    }
  }

  for (const page of getAll('page')) {
    if (['home', 'blog', 'get-a-valuation'].includes(page.slug)) continue;
    if (NOINDEX.test(page.slug)) continue;
    entries.push({
      url: url(page.path),
      lastModified: new Date(page.modified),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
