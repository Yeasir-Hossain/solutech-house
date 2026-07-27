import type { Metadata } from 'next';
import { getPosts } from '@/lib/content';
import { paginate } from '@/lib/paging';
import ArchiveGrid from '@/components/ArchiveGrid';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides, tips and news on selling your house fast.',
  alternates: { canonical: '/blog/' },
};

export default function BlogIndex() {
  const { items, page, totalPages } = paginate(getPosts(), 1);
  return (
    <>
      <PageHero title="Blog" subtitle="Guides, tips and news on selling your house fast." />
      <ArchiveGrid
        items={items}
        page={page}
        totalPages={totalPages}
        basePath="/blog"
        empty="No posts yet."
      />
      <CtaBand />
    </>
  );
}
