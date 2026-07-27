import Link from 'next/link';
import { getByTitle } from '@/lib/content';
import type { Item } from '@/lib/types';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import {
  ArticleGrid,
  BlogSection,
  FaqsSection,
  Prose,
  SliderSection,
  StepsSection,
  TrustLogos,
} from '@/components/sections';

const PROBLEMS: [string, string, string][] = [
  [
    '🏚',
    'Property in poor condition',
    'From outdated homes to houses needing major renovation. Neglected, partially renovated, or simply hard to sell — we still make a fair cash offer.',
  ],
  [
    '🧱',
    'Structural damage or subsidence',
    'Homes with serious structural concerns are difficult to sell through estate agents. We buy them, so you move on without costly repairs.',
  ],
  [
    '💧',
    'Damp, mould, or fire damage',
    'We purchase damaged properties across the UK, letting you avoid expensive restoration work and sell with minimal stress.',
  ],
  [
    '🔑',
    'Problem tenants',
    'Tenants in situ, rent arrears or a difficult let? We buy tenanted property without you having to seek possession first.',
  ],
  [
    '📄',
    'Legal or title issues',
    'Short leases, missing paperwork, restrictive covenants or probate complications — our legal team handles it and we cover the costs.',
  ],
  [
    '⛓',
    'Stuck in a broken property chain',
    'We buy with our own funds and are never part of a chain, so a collapsed sale doesn’t have to cost you your onward move.',
  ],
];

const STATS: [string, string][] = [
  ['3–6+', 'Months on the open market'],
  ['3 days', 'With us'],
  ['£0', 'Fees or legal costs'],
  ['0', 'Viewings required'],
];

const COMPARE: [string, string, string][] = [
  ['Speed', 'Typically 3–6+ months', 'Complete in as little as 3 days'],
  ['Certainty', 'Buyer can pull out at any time', 'Guaranteed buyer'],
  ['Property chain', 'Often part of a chain', 'No chain'],
  ['Fees', 'Estate agent fees and legal costs', 'No fees or hidden charges'],
  ['Condition', 'Often requires repairs, staging and tidying', 'We buy any condition'],
  ['Viewings', 'Multiple viewings and disruptions', 'No viewings required'],
  ['Price changes', 'Risk of renegotiation after surveys', 'Price agreed upfront'],
  ['Best for', 'Sellers with no urgency', 'Sellers with time-sensitive reasons'],
];

/**
 * This route is a page rather than a `reason`, but it sits under the
 * "Reasons To Sell" nav as "Problem Properties", so it gets the same designed
 * treatment as the reason sub-routes instead of the generic page template.
 */
export default function ProblemProperty({ page }: { page: Item }) {
  const reasons = getByTitle('reason', 8);

  return (
    <>
      <PageHero
        title="A faster way to sell problem properties"
        subtitle="We buy houses in any condition, with any issue. No fees, no delays, no stress."
        imageUrl="/img/renovation.jpg"
        form
        points={['Any condition', 'No repairs needed', 'Complete in as little as 3 days']}
      />

      <section className="wbah-section">
        <div className="wbah-container wbah-split">
          <div className="wbah-split__media" data-reveal>
            <img
              src="/img/kitchen.jpg"
              alt="A property in need of modernisation"
              loading="lazy"
              width={800}
              height={640}
            />
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Problem properties</span>
            <h2>We buy problem properties just like any other home</h2>
            <p>
              Whether your property has structural issues, damp, fire damage, tenants in situ, or
              simply needs modernising, we can still provide a fast and straightforward sale.
            </p>
            <p>
              We buy problem properties in the same simple way we buy regular homes — with no
              repairs, no estate agent fees, and no unnecessary delays.
            </p>
            <Link className="wbah-btn wbah-btn--primary" href="/get-a-valuation/">
              Get your offer
            </Link>
          </div>
        </div>
      </section>

      <section className="wbah-section wbah-section--alt">
        <div className="wbah-container">
          <div className="wbah-section-intro wbah-section-intro--wide" data-reveal>
            <span className="wbah-eyebrow">What we buy</span>
            <h2>We buy all types of problem properties across the UK</h2>
            <p>
              Not every property is market-ready, and that’s okay. Here are some of the issues we
              have resolved when helping homeowners sell.
            </p>
          </div>
          <div className="wbah-features">
            {PROBLEMS.map(([icon, title, text]) => (
              <div className="wbah-feature-card" data-reveal key={title}>
                <span className="wbah-feature-card__icon" aria-hidden="true">
                  {icon}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wbah-section wbah-section--dark">
        <div className="wbah-container">
          <div className="wbah-section-intro wbah-section-intro--wide" data-reveal>
            <span className="wbah-eyebrow wbah-eyebrow--light">You’re not alone</span>
            <h2>Finding it hard to sell your property?</h2>
            <p>
              Thousands of UK properties sit unsold each year due to condition, legal complications
              or tenant issues. Every month your property doesn’t sell, the costs add up — mortgage
              payments, maintenance, insurance and council tax.
            </p>
          </div>
          <div className="wbah-stats__grid">
            {STATS.map(([num, label]) => (
              <div className="wbah-stat" data-reveal key={label}>
                <span className="wbah-stat__num">{num}</span>
                <span className="wbah-stat__label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wbah-section">
        <div className="wbah-container">
          <div className="wbah-section-intro wbah-section-intro--wide" data-reveal>
            <span className="wbah-eyebrow">Compare</span>
            <h2>Which option fits your reason to sell?</h2>
          </div>
          <div className="wbah-compare-table" data-reveal>
            <table>
              <caption className="screen-reader-text">
                Traditional estate agent sale compared with a quick sale to us
              </caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Traditional sale</th>
                  <th scope="col" className="is-us">
                    Selling to us
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([feature, traditional, us]) => (
                  <tr key={feature}>
                    <th scope="row">{feature}</th>
                    <td>
                      <span className="wbah-x" aria-hidden="true">
                        ✕
                      </span>{' '}
                      {traditional}
                    </td>
                    <td className="is-us">
                      <span className="wbah-tick" aria-hidden="true">
                        ✓
                      </span>{' '}
                      {us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <StepsSection />
      <TrustLogos />

      {page.content.trim() ? (
        <ArticleGrid>
          <Prose html={page.content} />
        </ArticleGrid>
      ) : null}

      <SliderSection
        items={reasons}
        eyebrow="More reasons to sell"
        heading="Explore other situations we help with"
        viewAll="/reasons-to-sell/"
        alt
      />

      <BlogSection category="home-improvements" heading="Advice on problem properties" />
      <FaqsSection limit={8} heading="Frequently asked questions about selling problem properties" />
      <CtaBand title="Struggling to sell a problem property?" />
    </>
  );
}
