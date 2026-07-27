import PostcodeForm from './PostcodeForm';

interface Props {
  title?: string;
  text?: string;
}

/** Full-width closing call-to-action. */
export default function CtaBand({ title, text }: Props) {
  return (
    <section
      className="wbah-cta-band"
      style={{ ['--cta-img' as string]: "url('/img/keys.jpg')" }}
    >
      <div className="wbah-container wbah-cta-band__inner" data-reveal>
        <div className="wbah-cta-band__copy">
          <span className="wbah-eyebrow wbah-eyebrow--light">Free · No obligation</span>
          <h2>{title || 'Ready to sell your house fast?'}</h2>
          <p>
            {text ||
              'Enter your postcode for a free, no-obligation cash offer in as little as 15 minutes.'}
          </p>
        </div>
        <PostcodeForm cta="Get my free offer" />
      </div>
    </section>
  );
}
