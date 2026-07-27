import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getCategory, getPosts } from '@/lib/content';
import { extraPageParams, paginate } from '@/lib/paging';
import ArchiveGrid from '@/components/ArchiveGrid';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().flatMap((c) =>
    extraPageParams(getPosts({ category: c.slug }).length).map((p) => ({ slug: c.slug, ...p }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — page ${page}`,
    alternates: { canonical: `/blog/category/${slug}/page/${page}/` },
  };
}

export default async function CategoryPaged({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page: raw } = await params;
  const category = getCategory(slug);
  const requested = Number(raw);
  if (!category || !Number.isInteger(requested) || requested < 2) notFound();

  const { items, page, totalPages } = paginate(getPosts({ category: slug }), requested);
  if (page !== requested) notFound();

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
