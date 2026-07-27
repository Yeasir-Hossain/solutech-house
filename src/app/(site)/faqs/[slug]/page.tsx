import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAll, getBySlug } from '@/lib/content';
import { itemMetadata } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAll('faq').map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faq = getBySlug('faq', slug);
  return faq ? itemMetadata(faq) : {};
}

export default async function SingleFaq({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const faq = getBySlug('faq', slug);
  if (!faq) notFound();

  return (
    <>
      <PageHero title={faq.title} />
      <article className="wbah-single">
        <div className="wbah-container wbah-container--narrow wbah-single__wrap">
          <div className="entry-content" dangerouslySetInnerHTML={{ __html: faq.content }} />
          <p>
            <Link className="wbah-card__more" href="/faqs/">
              ‹ All FAQs
            </Link>
          </p>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
