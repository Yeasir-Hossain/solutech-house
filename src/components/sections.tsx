import Link from 'next/link';
import { getAll, getContextPosts } from '@/lib/content';
import type { Item } from '@/lib/types';
import Accordion from './Accordion';
import ItemsSlider from './ItemsSlider';

/** The dark "3-step process" band. */
const STEPS: [string, string, string][] = [
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

export function StepsSection({
  heading = 'How our house buying process works',
}: {
  heading?: string;
}) {
  return (
    <section className="wbah-section wbah-section--dark">
      <div className="wbah-container">
        <div className="wbah-section-intro" data-reveal>
          <span className="wbah-eyebrow wbah-eyebrow--light">Simple 3-step process</span>
          <h2>{heading}</h2>
        </div>
        <div className="wbah-steps">
          {STEPS.map(([num, title, text]) => (
            <div className="wbah-step" data-reveal key={num}>
              <span className="wbah-step__num">{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Compact 3-up benefits band used to break up long-form content. */
export function BenefitBand() {
  const items: [string, string, string][] = [
    ['⏱', 'Sell in as little as 3 days', 'Or on a longer timeline that suits you.'],
    ['💷', 'No fees or commission', 'The offer you accept is what you receive.'],
    ['✓', 'Guaranteed sale', 'We buy with our own funds — no chain, no drop-outs.'],
  ];
  return (
    <section className="wbah-section wbah-section--tight">
      <div className="wbah-container">
        <div className="wbah-features">
          {items.map(([icon, title, text]) => (
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
  );
}

/** Sticky "get an offer" aside that travels with long-form content. */
export function OfferAside() {
  const points = [
    'A cash offer in 15 minutes',
    'Complete in as little as 3 days',
    'No fees, no commission',
    'We cover all legal costs',
  ];
  return (
    <aside className="wbah-aside" data-reveal>
      <div className="wbah-aside__card">
        <span className="wbah-eyebrow">Free · No obligation</span>
        <h2 className="wbah-aside__title">Get your cash offer</h2>
        <ul className="wbah-ticks">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Link className="wbah-btn wbah-btn--primary wbah-btn--block" href="/get-a-valuation/">
          Make me an offer
        </Link>
        <p className="wbah-aside__note">
          Takes less than a minute. No viewings, no estate agents.
        </p>
      </div>
    </aside>
  );
}

/** Accreditation logo strip. Intrinsic sizes are required — a lazy image with
 *  no ratio collapses to zero width until it loads. */
export function TrustLogos() {
  const logos: [string, string, number, number][] = [
    ['/img/logos/companies-house.png', 'Companies House', 1000, 325],
    ['/img/logos/ICO-logo-png.webp', 'Information Commissioner’s Office', 330, 195],
    ['/img/logos/Property-Redress-logo.webp', 'Property Redress Scheme', 625, 224],
    ['/img/logos/hometrack-logo.png', 'Hometrack', 2125, 880],
  ];
  return (
    <section className="wbah-section wbah-trust">
      <div className="wbah-container">
        <p className="wbah-trust__title" data-reveal>
          The Nation’s most trusted house buyer
        </p>
        <ul className="wbah-trust__logos" data-reveal>
          {logos.map(([src, alt, w, h]) => (
            <li key={src}>
              <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "As featured in" press strip — all six assets share a 1000x300 intrinsic size. */
export function PressLogos() {
  const logos: [string, string][] = [
    ['/img/logos/Forbes-png.webp', 'Forbes'],
    ['/img/logos/YahooFinance-png.webp', 'Yahoo Finance'],
    ['/img/logos/Independant-png.webp', 'The Independent'],
    ['/img/logos/Mirror-png.webp', 'The Mirror'],
    ['/img/logos/DailyExpress-png.webp', 'Daily Express'],
    ['/img/logos/Sun-png.webp', 'The Sun'],
  ];
  return (
    <section className="wbah-press">
      <div className="wbah-container">
        <p className="wbah-press__title" data-reveal>
          As featured in
        </p>
        <ul className="wbah-press__logos" data-reveal>
          {logos.map(([src, alt]) => (
            <li key={src}>
              <img src={src} alt={alt} width={1000} height={300} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** FAQ accordion section pulled from the faq content set. */
export function FaqsSection({
  limit = 8,
  heading = 'Frequently asked questions',
}: {
  limit?: number;
  heading?: string;
}) {
  const faqs = getAll('faq').slice(0, limit);
  if (!faqs.length) return null;
  return (
    <section className="wbah-section wbah-section--alt">
      <div className="wbah-container wbah-container--narrow">
        <div className="wbah-section-intro" data-reveal>
          <span className="wbah-eyebrow">Good to know</span>
          <h2>{heading}</h2>
        </div>
        <Accordion
          entries={faqs.map((f) => ({ id: f.id, question: f.title, answer: f.content }))}
        />
        <div className="wbah-section-cta" data-reveal>
          <Link className="wbah-btn wbah-btn--ghost-dark" href="/faqs/">
            View all FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Blog slider scoped to a category, falling back to the newest posts so the
 * section never disappears on a page with no dedicated posts yet.
 */
export function BlogSection({
  category = '',
  heading = 'Guides, tips & news',
  limit = 6,
}: {
  category?: string;
  heading?: string;
  limit?: number;
}) {
  const posts = getContextPosts(category, limit);
  if (!posts.length) return null;
  return (
    <section className="wbah-section wbah-section--alt">
      <div className="wbah-container">
        <ItemsSlider items={posts} eyebrow="From the blog" heading={heading} viewAll="/blog/" />
      </div>
    </section>
  );
}

/** Long-form content rendered inside the shared prose styles. */
export function Prose({ html, className = 'entry-content wbah-prose' }: { html: string; className?: string }) {
  return <div className={className} data-reveal dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Two-column article grid: content beside the sticky offer aside. */
export function ArticleGrid({ children }: { children: React.ReactNode }) {
  return (
    <article className="wbah-article">
      <div className="wbah-container wbah-article__grid">
        {children}
        <OfferAside />
      </div>
    </article>
  );
}

/** A section wrapper around an items slider, matching the theme's spacing rhythm. */
export function SliderSection({
  items,
  eyebrow,
  heading,
  viewAll,
  alt = false,
}: {
  items: Item[];
  eyebrow?: string;
  heading: string;
  viewAll?: string;
  alt?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section className={`wbah-section${alt ? ' wbah-section--alt' : ''}`}>
      <div className="wbah-container">
        <ItemsSlider items={items} eyebrow={eyebrow} heading={heading} viewAll={viewAll} />
      </div>
    </section>
  );
}
