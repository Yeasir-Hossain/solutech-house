import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAll, getByTitle, getBySlug, reasonCategory } from '@/lib/content';
import { itemMetadata } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import {
  ArticleGrid,
  BenefitBand,
  BlogSection,
  FaqsSection,
  Prose,
  SliderSection,
  StepsSection,
  TrustLogos,
} from '@/components/sections';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAll('reason').map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const reason = getBySlug('reason', slug);
  return reason ? itemMetadata(reason) : {};
}

export default async function SingleReason({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reason = getBySlug('reason', slug);
  if (!reason) notFound();

  const others = getByTitle('reason', 8, reason.id);

  return (
    <>
      <PageHero
        title={reason.title}
        subtitle={reason.excerpt}
        image={reason.featured}
        form
        points={[
          'A fair, guaranteed offer',
          'No fees or commission',
          'Complete in as little as 3 days',
        ]}
      />

      <BenefitBand />

      <ArticleGrid>
        <Prose html={reason.content} />
      </ArticleGrid>

      <StepsSection />
      <TrustLogos />

      <SliderSection
        items={others}
        eyebrow="More reasons to sell"
        heading="Explore other situations we help with"
        viewAll="/reasons-to-sell/"
      />

      {/* Posts from the category that matches this reason (divorce, downsizing, …). */}
      <BlogSection category={reasonCategory(slug)} heading="Advice on your situation" />

      <FaqsSection limit={6} />
      <CtaBand />
    </>
  );
}
