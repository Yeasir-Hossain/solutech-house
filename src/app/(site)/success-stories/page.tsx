import Link from 'next/link';
import type { Metadata } from 'next';
import { getAll } from '@/lib/content';
import { stripTags, trimWords } from '@/lib/text';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import { FaqsSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'What our customers say',
  description:
    'Thousands of homeowners have sold their house to us the fast, hassle-free way. Read their stories.',
  alternates: { canonical: '/success-stories/' },
};

export default function SuccessStories() {
  const stories = getAll('success_story');
  return (
    <>
      <PageHero
        title="What our customers say"
        subtitle="Thousands of homeowners have sold their house to us the fast, hassle-free way. Here are just a few of their stories."
      />

      <section className="wbah-section">
        <div className="wbah-container">
          <div className="wbah-rating-summary" data-reveal>
            <span className="wbah-rating-summary__score">Excellent</span>
            <span className="wbah-rating-summary__stars" aria-hidden="true">
              ★★★★★
            </span>
            <span className="wbah-rating-summary__count">Based on 697+ verified reviews</span>
          </div>

          <div className="wbah-review-grid">
            {stories.map((story) => (
              <article className="wbah-review" data-reveal key={story.id}>
                <div className="wbah-review__stars" aria-hidden="true">
                  ★★★★★
                </div>
                <h3 className="wbah-review__title">{story.title}</h3>
                <p className="wbah-review__text">{trimWords(stripTags(story.content), 34)}</p>
                <Link className="wbah-review__more" href={story.path}>
                  Read story →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqsSection limit={6} />
      <CtaBand />
    </>
  );
}
