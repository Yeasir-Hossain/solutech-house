/** Shapes of the migrated content snapshot. Safe to import from client code. */

export type ItemType = 'post' | 'page' | 'faq' | 'success_story' | 'location' | 'reason';

export interface Image {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Category {
  name: string;
  slug: string;
}

export interface Item {
  id: number;
  type: ItemType;
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featured: Image | null;
  categories: Category[];
  menuOrder: number;
}

export interface Term extends Category {
  id: number;
  description: string;
  count: number;
  path: string;
}

export interface MenuItem {
  id: number;
  parent: number;
  order: number;
  title: string;
  path: string;
  external: boolean;
}

export interface MenuNode extends MenuItem {
  children: MenuNode[];
}
