import type { Item } from './types';

export const PAGE_SIZE = 12;

export function paginate(items: Item[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    page: current,
    totalPages,
  };
}

/** Page params for the /page/[page]/ routes — page 1 lives at the base path. */
export function extraPageParams(total: number) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}
