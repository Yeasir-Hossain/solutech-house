import type { Metadata } from 'next';
import { getByTitle } from '@/lib/content';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import {
  BlogSection,
  FaqsSection,
  SliderSection,
  StepsSection,
  TrustLogos,
} from '@/components/sections';

export const metadata: Metadata = {
  title: 'Sell your house fast, wherever you are',
  description:
    'We buy houses across the UK — from Manchester to London and everywhere in between. Get a free, no-obligation cash offer in as little as 15 minutes.',
  alternates: { canonical: '/sell-house-fast/' },
};

export default function LocationArchive() {
  const locations = getByTitle('location');
  return (
    <>
      <PageHero
        title="Sell your house fast, wherever you are"
        subtitle="We buy houses across the UK — from Manchester to London and everywhere in between. Enter your postcode for a free, no-obligation cash offer in as little as 15 minutes."
        form
      />

      <section className="wbah-section">
        <div className="wbah-container wbah-split wbah-split--reverse">
          <div className="wbah-split__media" data-reveal>
            <img src="/img/city.avif" alt="UK city skyline" loading="lazy" width={720} height={560} />
            <span className="wbah-split__badge">
              <strong>UK-wide</strong>cash buyer
            </span>
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Local expertise, national reach</span>
            <h2>A fast house sale in your area</h2>
            <p>
              Our team knows local markets inside out. Wherever your property is, we make selling
              simple, transparent and stress-free — with a fair offer based on real market
              research.
            </p>
            <ul className="wbah-ticks">
              <li>No estate agent fees or commission</li>
              <li>Guaranteed sale on your timescale</li>
              <li>We cover all legal costs</li>
            </ul>
          </div>
        </div>
      </section>

      <SliderSection items={locations} eyebrow="Areas we cover" heading="Find your location" alt />

      <StepsSection />
      <TrustLogos />
      <BlogSection
        category="sell-my-house-fast-blogs"
        heading="Selling your house fast: advice & guides"
      />
      <FaqsSection limit={8} />
      <CtaBand />
    </>
  );
}
