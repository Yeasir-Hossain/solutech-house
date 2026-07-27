import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getCategory, getPosts } from '@/lib/content';
import { paginate } from '@/lib/paging';
import ArchiveGrid from '@/components/ArchiveGrid';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description:
      category.description || `Advice, guides and news about ${category.name.toLowerCase()}.`,
    alternates: { canonical: `/blog/category/${slug}/` },
  };
}

export default async function CategoryArchive({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const { items, page, totalPages } = paginate(getPosts({ category: slug }), 1);

  return (
    <>
      <PageHero
        title={category.name}
        subtitle={
          category.description || `Advice, guides and news about ${category.name.toLowerCase()}.`
        }
      />
      <ArchiveGrid
        items={items}
        page={page}
        totalPages={totalPages}
        basePath={`/blog/category/${slug}`}
      />
      <CtaBand />
    </>
  );
}
