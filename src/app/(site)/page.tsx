import Link from 'next/link';
import type { Metadata } from 'next';
import { getByTitle, getContextPosts, getSite } from '@/lib/content';
import Card from '@/components/Card';
import CtaBand from '@/components/CtaBand';
import PostcodeForm from '@/components/PostcodeForm';
import StickySlider from '@/components/StickySlider';
import { COMPANY } from '@/lib/site';

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    // `absolute` — the layout's "%s | Brand" template would otherwise repeat
    // the brand name, which already appears in this title.
    title: { absolute: `${site.name} — Sell Your House Fast For Cash` },
    description: site.description,
    alternates: { canonical: '/' },
  };
}

const STATS: [string, string][] = [
  ['15 mins', 'To your free offer'],
  ['3 days', 'Fastest completion'],
  ['£0', 'Fees or commission'],
  ['Since 2008', 'The original cash buyer'],
];

const PROCESS: [string, string, string][] = [
  [
    '01',
    'Tell us about your property',
    'Share a few details through our simple online form — it takes less than a minute.',
  ],
  [
    '02',
    'Get your free cash offer',
    'One of our team calls you with a fair, no-obligation offer, usually within 15 minutes.',
  ],
  [
    '03',
    'Complete on your timescale',
    'Accept and we handle everything — legals included — completing in as little as 3 days.',
  ],
];

export default function HomePage() {
  const reasons = getByTitle('reason', 8);
  const recent = getContextPosts('we-buy-any-house', 3);

  return (
    <>
      <section className="wbah-hero" style={{ ['--hero-img' as string]: "url('/img/hero-aerial.webp')" }}>
        <div className="wbah-hero__overlay" />
        <div className="wbah-container wbah-hero__inner" data-reveal>
          <div className="wbah-rating">
            <span className="wbah-rating__stars" aria-hidden="true">
              ★★★★★
            </span>
            <span className="wbah-rating__text">Rated Excellent by 697+ homeowners</span>
          </div>
          <h1 className="wbah-hero__title">{COMPANY.name}</h1>
          <p className="wbah-hero__lead">
            The Nation’s trusted cash house buyer. A free offer in 15 minutes — sell in as little
            as 3 days.
          </p>
          <PostcodeForm cta="Get my offer" />
          <ul className="wbah-hero__points">
            <li>No fees or commission</li>
            <li>Any condition, anywhere</li>
            <li>Sell in as little as 3 days</li>
          </ul>
        </div>
        <div className="wbah-hero__scroll" aria-hidden="true">
          <span />
        </div>
      </section>

      <section className="wbah-stats">
        <div className="wbah-container wbah-stats__grid">
          {STATS.map(([num, label]) => (
            <div className="wbah-stat" data-reveal key={label}>
              <span className="wbah-stat__num">{num}</span>
              <span className="wbah-stat__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wbah-section">
        <div className="wbah-container wbah-split">
          <div className="wbah-split__media" data-reveal>
            <img src="/img/city.avif" alt="UK terraced houses" loading="lazy" width={720} height={560} />
            <span className="wbah-split__badge">
              <strong>15+ yrs</strong>buying homes
            </span>
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Any Condition · Anywhere</span>
            <h2>We buy any house, in any condition, anywhere in the UK</h2>
            <p>
              Whatever your reason for selling, we help homeowners avoid the stress and
              uncertainty of the traditional process — no chain, no viewings, no fees.
            </p>
            <ul className="wbah-ticks">
              <li>A guaranteed sale — no buyer drop-outs</li>
              <li>We cover all legal and survey costs</li>
              <li>Completion on a date that suits you</li>
            </ul>
            <Link className="wbah-btn wbah-btn--primary" href="/how-it-works/">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section className="wbah-section wbah-section--dark">
        <div className="wbah-container">
          <div className="wbah-section-intro" data-reveal>
            <span className="wbah-eyebrow wbah-eyebrow--light">Simple 3-step process</span>
            <h2>Sell your house fast in three easy steps</h2>
          </div>
          <div className="wbah-steps">
            {PROCESS.map(([num, title, text]) => (
              <div className="wbah-step" data-reveal key={num}>
                <span className="wbah-step__num">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="wbah-section-cta" data-reveal>
            <Link className="wbah-btn wbah-btn--cta" href="/get-a-valuation/">
              Get my free offer
            </Link>
          </div>
        </div>
      </section>

      <section className="wbah-section">
        <div className="wbah-container wbah-split wbah-split--reverse">
          <div className="wbah-split__media" data-reveal>
            <img
              src="/img/street.webp"
              alt="A street of typical UK family homes"
              loading="lazy"
              width={1260}
              height={700}
            />
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Why choose us</span>
            <h2>The trusted name in fast house sales since 2008</h2>
            <p>
              Tens of thousands of homeowners have trusted us to buy their house quickly and
              effortlessly. We guarantee to buy — no delays, no drop-outs, no matter the condition
              or location.
            </p>
            <div className="wbah-mini-grid">
              <div className="wbah-mini">
                <strong>Guaranteed sale</strong>
                <span>We buy directly, so there’s no chain to collapse.</span>
              </div>
              <div className="wbah-mini">
                <strong>Fair cash offers</strong>
                <span>Based on real, accurate market research.</span>
              </div>
            </div>
            <Link className="wbah-btn wbah-btn--ghost-dark" href="/why-choose-us/">
              Why choose us
            </Link>
          </div>
        </div>
      </section>

      <StickySlider
        items={reasons}
        eyebrow="Reasons to sell"
        heading="Whatever your situation, we can help"
        copy="People come to us for very different reasons — a chain that collapsed, an inherited house they cannot maintain, a move that has to happen fast. Whatever brought you here, the offer and the timeline work the same way."
        viewAll="/reasons-to-sell/"
      />

      <section className="wbah-section wbah-section--alt">
        <div className="wbah-container">
          <div className="wbah-section-intro" data-reveal>
            <span className="wbah-eyebrow">The smart way to sell</span>
            <h2>How we compare to estate agents</h2>
          </div>
          <div className="wbah-compare" data-reveal>
            <div className="wbah-compare__card wbah-compare__card--win">
              <span className="wbah-compare__tag">Recommended</span>
              <h3>{COMPANY.name}</h3>
              <p className="wbah-compare__time">3 days</p>
              <ul className="wbah-ticks">
                <li>Guaranteed cash sale</li>
                <li>Zero fees — we cover legals</li>
                <li>No viewings or chain</li>
                <li>You keep ~£80,000 on a £100k home</li>
              </ul>
            </div>
            <div className="wbah-compare__card">
              <h3>Estate Agents</h3>
              <p className="wbah-compare__time">6–9 months</p>
              <ul className="wbah-crosses">
                <li>Sale can fall through</li>
                <li>Agent + legal fees</li>
                <li>Endless viewings</li>
                <li>Months of bills while you wait</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {recent.length ? (
        <section className="wbah-section">
          <div className="wbah-container">
            <div className="wbah-slider-head" data-reveal>
              <div className="wbah-section-intro wbah-section-intro--left">
                <span className="wbah-eyebrow">From the blog</span>
                <h2>Guides, tips &amp; news</h2>
              </div>
              <Link className="wbah-btn wbah-btn--ghost-dark wbah-btn--sm" href="/blog/">
                View all
              </Link>
            </div>
            <div className="wbah-card-grid">
              {recent.map((post) => (
                <Card key={post.id} item={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
