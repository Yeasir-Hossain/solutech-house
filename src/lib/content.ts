/**
 * Content access layer (server only).
 *
 * The site's editorial content is a static snapshot migrated out of WordPress
 * (see scripts/build-content.mjs) and committed under content/. Everything is
 * read at build time and rendered statically — there is no CMS at runtime, and
 * MongoDB is used only for form submissions.
 */
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import type { Item, ItemType, MenuItem, MenuNode, Term } from './types';

export type * from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function load<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `${name}.json`), 'utf8')) as T;
}

export const getAll = cache((type: ItemType): Item[] => load<Item[]>(type));

export const getSite = cache(() =>
  load<{ name: string; description: string; counts: Record<string, number> }>('site')
);

export const getTaxonomies = cache(() => load<Record<string, Term[]>>('taxonomies'));

const getMenus = cache(() => load<Record<string, MenuItem[]>>('menus'));

/** Nav menus are stored flat with parent ids; templates want a tree. */
export const getMenu = cache((location: string): MenuNode[] => {
  const items = getMenus()[location] || [];
  const nodes = new Map<number, MenuNode>(items.map((i) => [i.id, { ...i, children: [] }]));
  const roots: MenuNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parent ? nodes.get(node.parent) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  const sort = (list: MenuNode[]) => {
    list.sort((a, b) => a.order - b.order);
    list.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
});

export const getBySlug = cache((type: ItemType, slug: string): Item | undefined =>
  getAll(type).find((i) => i.slug === slug)
);

export const getCategories = cache((): Term[] =>
  (getTaxonomies().category || []).filter((c) => c.count > 0)
);

export const getCategory = cache((slug: string): Term | undefined =>
  getCategories().find((c) => c.slug === slug)
);

interface PostQuery {
  category?: string;
  limit?: number;
  excludeId?: number;
}

/** Blog posts, newest first, optionally scoped to a category. */
export function getPosts({ category, limit, excludeId }: PostQuery = {}): Item[] {
  let posts = getAll('post');
  if (category) posts = posts.filter((p) => p.categories.some((c) => c.slug === category));
  if (excludeId) posts = posts.filter((p) => p.id !== excludeId);
  posts = [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return typeof limit === 'number' ? posts.slice(0, limit) : posts;
}

/** Sorted by title — used for the reason/location card tracks. */
export function getByTitle(type: ItemType, limit?: number, excludeId?: number): Item[] {
  let items = [...getAll(type)].sort((a, b) => a.title.localeCompare(b.title));
  if (excludeId) items = items.filter((i) => i.id !== excludeId);
  return typeof limit === 'number' ? items.slice(0, limit) : items;
}

/**
 * Map a page context onto a blog category, so a page shows posts about its own
 * subject rather than a generic "latest" list. Reason slugs don't always match
 * their category slug, so the exceptions are explicit.
 */
const REASON_CATEGORY: Record<string, string> = {
  divorce: 'divorce',
  downsizing: 'downsizing',
  repossession: 'repossession',
  retirement: 'retirement',
  'selling-inherited-property': 'inheritance',
  'tenanted-property': 'tenanted-property',
};

export function reasonCategory(slug: string): string {
  return REASON_CATEGORY[slug] ?? slug;
}

/** Posts for a context category, falling back to the newest posts of any category. */
export function getContextPosts(category: string, limit = 6): Item[] {
  const scoped = category ? getPosts({ category, limit }) : [];
  return scoped.length ? scoped : getPosts({ limit });
}
