import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { extraPageParams, paginate } from '@/lib/paging';
import ArchiveGrid from '@/components/ArchiveGrid';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const dynamicParams = false;

export function generateStaticParams() {
  return extraPageParams(getPosts().length);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog — page ${page}`,
    description: 'Guides, tips and news on selling your house fast.',
    alternates: { canonical: `/blog/page/${page}/` },
  };
}

export default async function BlogPaged({ params }: { params: Promise<{ page: string }> }) {
  const { page: raw } = await params;
  const requested = Number(raw);
  if (!Number.isInteger(requested) || requested < 2) notFound();

  const { items, page, totalPages } = paginate(getPosts(), requested);
  if (page !== requested) notFound();

  return (
    <>
      <PageHero title="Blog" subtitle="Guides, tips and news on selling your house fast." />
      <ArchiveGrid items={items} page={page} totalPages={totalPages} basePath="/blog" />
      <CtaBand />
    </>
  );
}
