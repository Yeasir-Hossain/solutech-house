import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAll, getBySlug } from '@/lib/content';
import { itemMetadata } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAll('success_story').map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getBySlug('success_story', slug);
  return story ? itemMetadata(story, 'article') : {};
}

export default async function SingleStory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getBySlug('success_story', slug);
  if (!story) notFound();

  return (
    <>
      <PageHero title={story.title} image={story.featured} />
      <article className="wbah-single wbah-story">
        <div className="wbah-container wbah-single__wrap">
          <div className="wbah-story__stars" aria-label="5 out of 5 stars">
            ★★★★★
          </div>
          <div className="entry-content" dangerouslySetInnerHTML={{ __html: story.content }} />
          <p>
            <Link className="wbah-btn wbah-btn--primary" href="/success-stories/">
              More success stories
            </Link>
          </p>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
