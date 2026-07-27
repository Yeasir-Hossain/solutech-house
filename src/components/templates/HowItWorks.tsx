import Link from 'next/link';
import { getByTitle } from '@/lib/content';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import {
  BlogSection,
  FaqsSection,
  PressLogos,
  SliderSection,
  TrustLogos,
} from '@/components/sections';

const FLOW: [string, string, string, string][] = [
  [
    '01',
    'Complete our quick online form',
    'We believe in keeping things simple. The first step is to complete our short online form, providing us with a few basic details about your property. It takes less than a minute to fill out, and ensures we provide you with our best possible offer.',
    'Takes under a minute',
  ],
  [
    '02',
    'Our property experts contact you with your personalised offer',
    'One of our experienced property experts will call at a time that suits you, gather a little more information about your circumstances, and provide your no-obligation cash offer — prepared using the same market-leading valuation technology trusted by mortgage lenders and banks.',
    'Usually within 15 minutes',
  ],
  [
    '03',
    'Take your time to decide',
    'Selling your house is a big decision, so we give you room to think. Your offer stays valid for 7 days. Accept it and we handle all the paperwork and cover all the legal costs, so you can focus on your next steps with complete confidence.',
    'Offer valid for 7 days',
  ],
  [
    '04',
    'We arrange an independent property appraisal',
    'Once you have accepted our offer we arrange — and pay for — an independent appraisal. This confirms the condition of your property and lets us finalise your offer. It is the only time we need to view your property, and it is scheduled at your convenience.',
    'We cover the cost',
  ],
  [
    '05',
    'You receive your cash',
    'Once the paperwork is complete we transfer your funds and take ownership of the property. The entire process can complete in as little as three days, or on a longer timeline that suits your needs.',
    'In as little as 3 days',
  ],
];

const BENEFITS: [string, string, string][] = [
  [
    '⏱',
    'Sell in as little as 3 days',
    'We can complete the purchase of your property in as little as three days. Prefer more time? We’ll work on a timeline that suits your needs.',
  ],
  [
    '💷',
    'Your cash offer in 15 minutes',
    'Fill out our online form and we will provide you with a personalised cash offer for your property.',
  ],
  [
    '✓',
    'A simple, hassle-free sale',
    'From the moment you contact us we take care of everything — managing every detail of the sale, including all the legal complexities.',
  ],
];

const STATS: [string, string][] = [
  ['18+', 'Years buying UK homes'],
  ['2,000+', 'People helped every month'],
  ['3 days', 'Fastest completion'],
  ['£0', 'Fees or legal costs to you'],
];

export default function HowItWorks() {
  const reasons = getByTitle('reason', 8);

  return (
    <>
      <PageHero
        title="Find out how our quick sale service works"
        subtitle="Enjoy a guaranteed, hassle-free sale with our market-leading service — from your first enquiry to cash in your account in as little as 3 days."
        imageUrl="/img/street.webp"
        form
      />

      <section className="wbah-section">
        <div className="wbah-container">
          <div className="wbah-section-intro wbah-section-intro--wide" data-reveal>
            <span className="wbah-eyebrow">How our service works</span>
            <h2>Discover how to sell your house quickly to us</h2>
            <p>
              Our market-leading approach means we have the flexibility to adapt to your unique set
              of circumstances, and can work to your timescales to provide a smooth purchase of
              your property. Here are the five steps from your first enquiry to cash in your
              account.
            </p>
          </div>
          <ol className="wbah-flow">
            {FLOW.map(([num, title, text, meta]) => (
              <li className="wbah-flow__item" data-reveal key={num}>
                <span className="wbah-flow__num">{num}</span>
                <div className="wbah-flow__body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="wbah-flow__meta">{meta}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="wbah-section-cta" data-reveal>
            <Link className="wbah-btn wbah-btn--primary" href="/get-a-valuation/">
              Sell my house now
            </Link>
          </div>
        </div>
      </section>

      <section className="wbah-section wbah-section--alt">
        <div className="wbah-container">
          <div className="wbah-section-intro wbah-section-intro--wide" data-reveal>
            <span className="wbah-eyebrow">The benefits</span>
            <h2>Why sell your property to us?</h2>
          </div>
          <div className="wbah-features">
            {BENEFITS.map(([icon, title, text]) => (
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

      <section className="wbah-section">
        <div className="wbah-container wbah-split">
          <div className="wbah-split__media" data-reveal>
            <img
              src="/img/living-room.jpg"
              alt="A bright, modern living room"
              loading="lazy"
              width={800}
              height={469}
            />
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Cash house buyers</span>
            <h2>What do cash house buyers actually do?</h2>
            <p>
              We are a cash house buyer, meaning we have the funds available now to purchase your
              property outright. With no mortgage needed to complete, we bypass the traditional
              sale and completion stages of a property sale — saving you time and stress.
            </p>
            <p>
              Unlike selling through an estate agent, we handle everything, including dealing with
              the solicitors and completing all the legal work, so you don’t have to. That makes us
              your fastest route to the funds from your sale — cash in your bank in as little as
              three days.
            </p>
            <Link className="wbah-btn wbah-btn--primary" href="/get-a-valuation/">
              Get your offer now
            </Link>
          </div>
        </div>
      </section>

      <section className="wbah-section wbah-section--dark">
        <div className="wbah-container">
          <div className="wbah-section-intro wbah-section-intro--wide" data-reveal>
            <span className="wbah-eyebrow wbah-eyebrow--light">Why sell to us</span>
            <h2>The UK’s most trusted fast house sale company</h2>
            <p>
              As members of the Property Redress Scheme, transparency and integrity sit at the
              front of our service. Every transaction is overseen to make sure we deliver the
              customer service you deserve.
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

      <TrustLogos />

      <SliderSection
        items={reasons}
        eyebrow="Common situations"
        heading="Why might you want to sell your house quickly?"
        viewAll="/reasons-to-sell/"
      />

      <PressLogos />
      <FaqsSection limit={8} heading="Selling your home with us: all your questions answered" />
      <BlogSection category="we-buy-any-house" heading="More on selling your house fast" />
      <CtaBand title="Get your cash offer now" />
    </>
  );
}
