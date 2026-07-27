import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAll, getByTitle, getBySlug } from '@/lib/content';
import { itemMetadata } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import StickySlider from '@/components/StickySlider';
import {
  ArticleGrid,
  BenefitBand,
  BlogSection,
  FaqsSection,
  Prose,
  StepsSection,
  TrustLogos,
} from '@/components/sections';
import AboutUs from '@/components/templates/AboutUs';
import HowItWorks from '@/components/templates/HowItWorks';
import ProblemProperty from '@/components/templates/ProblemProperty';
import WhyChooseUs from '@/components/templates/WhyChooseUs';

/** Pages that have their own route file and must not also be produced here. */
const RESERVED = new Set(['home', 'blog', 'get-a-valuation']);

/**
 * Legal and utility pages render as plain documents. A designed marketing
 * treatment on a privacy policy adds noise, not conversion.
 */
const PLAIN = /(privacy|cookie|terms|acceptable-use|complaints|thank-you|ebook|referral|disclaimer)/;

export const dynamicParams = false;

export function generateStaticParams() {
  return getAll('page')
    .filter((p) => !RESERVED.has(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getBySlug('page', slug);
  if (!page) return {};
  const meta = itemMetadata(page);
  // Utility pages shouldn't compete with the real content in search results.
  return PLAIN.test(slug) ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getBySlug('page', slug);
  if (!page || RESERVED.has(slug)) notFound();

  switch (slug) {
    case 'how-it-works':
      return <HowItWorks />;
    case 'about-us':
      return <AboutUs />;
    case 'why-choose-us':
      return <WhyChooseUs />;
    case 'sell-problem-property-fast':
      return <ProblemProperty page={page} />;
  }

  if (PLAIN.test(slug)) {
    return (
      <>
        <PageHero title={page.title} image={page.featured} />
        <article className="wbah-single">
          <div className="wbah-container wbah-single__wrap">
            <div className="entry-content" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </article>
        <CtaBand />
      </>
    );
  }

  return (
    <>
      <PageHero title={page.title} subtitle={page.excerpt} image={page.featured} />
      <BenefitBand />

      <ArticleGrid>
        <Prose html={page.content} />
      </ArticleGrid>

      <StepsSection />
      <TrustLogos />

      <StickySlider
        items={getByTitle('reason', 8)}
        eyebrow="Reasons to sell"
        heading="Whatever your situation, we can help"
        copy="Whatever brought you here, the offer and the timeline work the same way — a free valuation, a guaranteed cash offer, and a completion date you choose."
        viewAll="/reasons-to-sell/"
      />

      <BlogSection heading="Advice and guides" />
      <FaqsSection limit={6} />
      <CtaBand />
    </>
  );
}
