import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAll, getByTitle, getBySlug } from '@/lib/content';
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
  return getAll('location').map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getBySlug('location', slug);
  return location ? itemMetadata(location) : {};
}

export default async function SingleLocation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getBySlug('location', slug);
  if (!location) notFound();

  const others = getByTitle('location', 8, location.id);

  return (
    <>
      <PageHero
        title={location.title}
        subtitle={location.excerpt}
        image={location.featured}
        form
        points={['No hassle, no fees', 'Zero commission', 'A fair, guaranteed offer']}
      />

      <BenefitBand />

      <ArticleGrid>
        <Prose html={location.content} />
      </ArticleGrid>

      <StepsSection />
      <TrustLogos />

      <SliderSection
        items={others}
        eyebrow="Other areas"
        heading="We buy houses across the UK"
        viewAll="/sell-house-fast/"
      />

      <BlogSection
        category="sell-my-house-fast-blogs"
        heading="Selling your house fast: advice & guides"
      />
      <FaqsSection limit={6} />
      <CtaBand />
    </>
  );
}
