import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

const VALUES: [string, string, string][] = [
  ['🤝', 'Honest advice', 'Straightforward guidance with no jargon and no pressure.'],
  ['💬', 'Fast communication', 'We keep you informed at every step, from offer to completion.'],
  ['🏡', 'Property expertise', 'Thousands of homeowners helped to sell their home the easy way.'],
  ['❤', 'People first', 'Every situation is different — we treat every homeowner with care.'],
];

const ADVANTAGES: [string, string][] = [
  ['Genuine cash buyer', 'We buy with our own funds — no third-party lenders, no chain.'],
  [
    'Regulated & accountable',
    'Members of the Property Ombudsman and Property Redress Scheme.',
  ],
  ['98% of sales complete', 'Once we agree a price, we see it through — no drop-outs.'],
  ['No fees', 'We cover all legal costs. The offer you accept is what you receive.'],
  ['Any home, any condition', 'Any property, any location, any state of repair.'],
  ['Operating since 2008', 'The original cash buyer, with 15+ years’ experience.'],
];

const JOURNEY: [string, string, string][] = [
  [
    '2008',
    'The company is founded',
    'The UK’s original cash house buyer opens its doors, offering a faster, more reliable alternative to the traditional estate agency.',
  ],
  [
    '2015',
    'Nationwide coverage',
    'Our reach extends across England, Scotland and Wales, buying thousands of homes year on year.',
  ],
  [
    '2020',
    'Trusted through tough times',
    'We help homeowners sell quickly and safely when certainty matters most.',
  ],
  [
    'Today',
    'Thousands of happy homeowners',
    'We continue to combine local expertise with a guaranteed, hassle-free sale — putting people first every time.',
  ],
];

export default function AboutUs() {
  return (
    <>
      <PageHero
        title="About us"
        subtitle="Property experts. Real people. Here to help you sell with speed, certainty and confidence."
        imageUrl="/img/door.jpg"
      />

      <section className="wbah-section">
        <div className="wbah-container">
          <div className="wbah-section-intro" data-reveal>
            <span className="wbah-eyebrow">About us</span>
            <h2>Property experts. Real people. Here to help.</h2>
            <p>
              From your first enquiry through to completion, our focus is simple: honest advice,
              clear communication and a smoother way to move forward.
            </p>
          </div>
          <div className="wbah-values">
            {VALUES.map(([icon, title, text]) => (
              <div className="wbah-value" data-reveal key={title}>
                <span className="wbah-value__icon" aria-hidden="true">
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
        <div className="wbah-container">
          <div className="wbah-section-intro" data-reveal>
            <span className="wbah-eyebrow">Why choose us</span>
            <h2>The advantages of selling with us</h2>
          </div>
          <div className="wbah-advantages">
            {ADVANTAGES.map(([title, text]) => (
              <div className="wbah-advantage" data-reveal key={title}>
                <span className="wbah-advantage__check" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wbah-section">
        <div className="wbah-container">
          <div className="wbah-section-intro" data-reveal>
            <span className="wbah-eyebrow">Our story</span>
            <h2>Our journey</h2>
          </div>
          <ol className="wbah-timeline">
            {JOURNEY.map(([year, title, text]) => (
              <li className="wbah-milestone" data-reveal key={year}>
                <span className="wbah-milestone__year">{year}</span>
                <div className="wbah-milestone__body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
