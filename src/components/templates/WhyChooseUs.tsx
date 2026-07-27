import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import { BlogSection, PressLogos, StepsSection, TrustLogos } from '@/components/sections';

const FEATURES: [string, string, string][] = [
  [
    '⏱',
    'Sell in as little as 3 days',
    'As one of the fastest cash buyers in the market, we can complete in as little as 3 days — or on a longer timescale to suit you.',
  ],
  [
    '💷',
    'A cash offer in 15 minutes',
    'Our online form takes less than a minute. Fill it in and we’ll be in touch with your no-obligation offer.',
  ],
  [
    '✓',
    'Fully managed, hassle-free',
    'From the moment we agree a price we manage every aspect of your sale, including all legal documentation.',
  ],
];

export default function WhyChooseUs() {
  return (
    <>
      <PageHero
        title="Why choose to sell your home to us?"
        subtitle="We deliver a fast, stress-free property sale tailored to your needs. Here’s what makes us the Nation’s most trusted house buyer."
        imageUrl="/img/hero-aerial.webp"
      />

      <section className="wbah-section">
        <div className="wbah-container">
          <div className="wbah-section-intro" data-reveal>
            <span className="wbah-eyebrow">The benefits</span>
            <h2>Why sell your property to us?</h2>
          </div>
          <div className="wbah-features">
            {FEATURES.map(([icon, title, text]) => (
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

      <section className="wbah-section wbah-section--alt">
        <div className="wbah-container wbah-split">
          <div className="wbah-split__media" data-reveal>
            <img
              src="/img/living-room.jpg"
              alt="A bright, modern living room in a UK home"
              loading="lazy"
              width={800}
              height={469}
            />
          </div>
          <div className="wbah-split__text" data-reveal>
            <span className="wbah-eyebrow">Our promise</span>
            <h2>We guarantee to buy your house</h2>
            <p>
              Selling your house is a big decision, and the choice you make impacts how long and
              stressful the process will be. Our guarantee is simple: we will buy your house — with
              no delays and no buyer drop-outs.
            </p>
            <p>
              That security is why thousands of homeowners across the UK choose us. No matter your
              property’s condition or location, we’re ready to buy.
            </p>
            <Link className="wbah-btn wbah-btn--primary" href="/get-a-valuation/">
              Get your offer
            </Link>
          </div>
        </div>
      </section>

      <TrustLogos />
      <StepsSection />
      <PressLogos />
      <BlogSection category="we-buy-any-house" heading="Why homeowners choose us" />
      <CtaBand />
    </>
  );
}
