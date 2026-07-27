import Link from 'next/link';
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
  title: 'Reasons to sell your house quickly',
  description:
    'Divorce, inheritance, downsizing, repossession, retirement or a tenanted property — whatever your reason for selling, we can help you move on quickly.',
  alternates: { canonical: '/reasons-to-sell/' },
};

export default function ReasonArchive() {
  const reasons = getByTitle('reason');
  return (
    <>
      <PageHero
        title="Reasons to sell your house quickly"
        subtitle="There are many reasons to sell your house, and lots of them involve wanting to move away from financial pressure or personal circumstances. Whatever yours, we can help you move on quickly."
      />

      <section className="wbah-section">
        <div className="wbah-container wbah-split">
          <div className="wbah-split__media" data-reveal>
            <img
              src="/img/couple.jpg"
              alt="Homeowners reviewing their options"
              loading="lazy"
              width={720}
              height={560}
            />
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Why homeowners choose us</span>
            <h2>Why people sell their homes to us</h2>
            <p>
              Whatever your circumstances, we provide a straightforward, stress-free way to sell —
              giving you the confidence and freedom to move forward on your terms.
            </p>
            <ul className="wbah-ticks">
              <li>A guaranteed sale with no fees or drop-outs</li>
              <li>Complete in as little as 3 days</li>
              <li>We buy in any condition, anywhere in the UK</li>
            </ul>
            <Link className="wbah-btn wbah-btn--primary" href="/get-a-valuation/">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <SliderSection
        items={reasons}
        eyebrow="Reasons to sell"
        heading="Whatever your situation, we can help"
        alt
      />

      <StepsSection />
      <TrustLogos />
      <BlogSection category="we-buy-any-house" heading="Advice for every situation" />
      <FaqsSection limit={8} />
      <CtaBand />
    </>
  );
}
